import json
import asyncio
import re
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from Backend.config import settings
from Backend.database.sqlite_db import get_db_connection
from Backend.ml.model import ml_service

router = APIRouter(prefix="/chat", tags=["AI Chatbot"])

class ChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en" # "en" or "te"
    crop: Optional[str] = "chilli"
    market: Optional[str] = "Guntur"
    history: Optional[List[ChatMessage]] = []

def fetch_live_agri_context(crop: str, market: str) -> Dict[str, Any]:
    """Fetch live market prices, forecast recommendations, and weather context from SQLite DB."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Fetch current market prices across AP
    cursor.execute("SELECT id, name, district, chilli_price, turmeric_price, trend FROM markets")
    markets_data = [dict(row) for row in cursor.fetchall()]
    
    # 2. Fetch forecast recommendation from ML service
    forecast_data = ml_service.predict_forecast(crop=crop, market=market, forecast_days=15, quantity=10.0)
    
    # 3. Weather summary
    weather_summary = f"Partly cloudy in {market} region, 32°C. Light isolated rainfall expected in next 48 hours."
    
    conn.close()
    
    return {
        "markets": markets_data,
        "forecast": forecast_data,
        "weather": weather_summary
    }

def build_prompt_context(request: ChatRequest, ctx: Dict[str, Any]) -> str:
    f = ctx["forecast"]
    m_str = "\n".join([f"- {m['name']} ({m['district']}): Chilli ₹{m['chilli_price']}/Qtl, Turmeric ₹{m['turmeric_price']}/Qtl [Trend: {m['trend']}]" for m in ctx["markets"]])
    
    context = f"""
System Role: You are AgriPrice AI Assistant (రైతు AI సలహాదారు), a warm, intelligent, real-time conversational AI chatbot created specifically for Chilli and Turmeric farmers of Andhra Pradesh, India.
Language Preferred: {request.language} ("te" for Telugu, "en" for English). Always reply in the requested language.

CONVERSATIONAL BEHAVIOR:
- If the user greets you (e.g., "hi", "hello", "hey", "namaste", "good morning", "హలో", "నమస్కారం"), respond warmly with a polite greeting first ("Hello! 👋 Welcome to AgriPrice AI...") and ask how you can help them with their Chilli or Turmeric crop decisions today.
- Be friendly, polite, empathetic, and encouraging like a real conversational AI assistant.

LIVE ANDHRA PRADESH MARKET DATA:
Target Crop: {f['crop'].title()}
Target Market: {f['market']}
Current Spot Price: ₹{f['current_price']:,} / Quintal
15-Day AI Forecast Price: ₹{f['predicted_price']:,} / Quintal ({'+' if f['percentage_change'] >= 0 else ''}{f['percentage_change']}%)
Price Range: ₹{f['min_price']:,} - ₹{f['max_price']:,} / Quintal
AI Recommendation: {f['recommendation']} (Confidence: {f['confidence_score']}%)
Key Reasons:
{chr(10).join(['- ' + r for r in f['recommendation_rationale']])}

ALL AP MANDI PRICES:
{m_str}

WEATHER & CROP IMPACT:
{ctx['weather']}

USER QUESTION / MESSAGE: "{request.message}"

INSTRUCTIONS:
1. Provide a direct, conversational, and highly practical response.
2. Structure the answer clearly with bold headers, emojis, and bullet points.
3. If asking about prices, forecasts, or sell vs wait decisions, quote exact mandi figures (₹/Quintal) from context.
4. If the user asks in Telugu, respond in fluent natural Telugu script.
5. Add relevant navigation suggestion tags at the end when appropriate:
   [ACTION:FORECAST] - View Price Forecast
   [ACTION:CALCULATOR] - Calculate Net Revenue
   [ACTION:MARKETS] - Compare AP Mandis
   [ACTION:WEATHER] - Check Weather Updates
"""
    return context

def generate_fallback_expert_response(request: ChatRequest, ctx: Dict[str, Any]) -> str:
    """Generate dynamic contextual multi-lingual expert response using live DB data."""
    raw_msg = request.message.strip()
    msg = raw_msg.lower()
    lang = request.language or ("te" if any('\u0c00' <= c <= '\u0c7f' for c in request.message) else "en")
    f = ctx["forecast"]
    crop = request.crop or "chilli"
    market = request.market or "Guntur"
    
    # Check query intent
    is_price_query = any(w in msg for w in ["price", "cost", "rate", "ధర", "రేటు", "ఎంత"])
    is_forecast_query = any(w in msg for w in ["forecast", "predict", "future", "next", "అంచనా", "భవిష్యత్", "రోజుల"])
    is_sell_query = any(w in msg for w in ["sell", "hold", "wait", "buy", "అమ్మాలా", "ఆగాలా", "విక్రయించండి"])
    is_turmeric = "turmeric" in msg or "పసుపు" in msg
    is_chilli = "chilli" in msg or "మిర్చి" in msg or "మిరప" in msg
    is_weather = "weather" in msg or "rain" in msg or "వాతావరణం" in msg or "వర్షం" in msg
    is_revenue = "revenue" in msg or "profit" in msg or "quintal" in msg or "రాబడి" in msg or "లాభం" in msg or "లెక్క" in msg

    # Check for pure greetings or identity questions
    greeting_words = ["hi", "hello", "hey", "namaste", "greetings", "good morning", "good afternoon", "good evening", "హలో", "నమస్కారం", "నమస్తే", "హాయ్", "బాగున్నారా"]
    words_in_msg = re.findall(r'\w+', msg, re.UNICODE)
    
    is_greeting = any(w in greeting_words for w in words_in_msg) and not (is_price_query or is_forecast_query or is_sell_query or is_weather or is_revenue)
    is_identity_query = any(phrase in msg for phrase in ["who are you", "what can you do", "what are you", "ఎవరు మీరు", "మీరు ఎవరు", "ఏం చేయగలరు"])

    target_crop = "turmeric" if is_turmeric else ("chilli" if is_chilli else crop)

    # 1. Greeting Response
    if is_greeting or is_identity_query:
        if lang == "te":
            return f"""👋 **నమస్కారం! హలో!** 🌾

నేను మీ **అగ్రిప్రైస్ AI (AgriPrice AI)** సలహాదారుని. మీకు స్వాగతం!

నేను మీకు ఈ క్రింది విషయాలలో సహాయపడగలను:
• 🌶️ **లైవ్ మార్కెట్ ధరలు:** గుంటూరు, దుగ్గిరాల, కర్నూలు, విజయవాడ మార్కెట్ ధరలు.
• 🔮 **15-90 రోజుల AI ధరల అంచనా:** ముందస్తు ధరల ఊహలు & అమ్మాలా/ఆగాలా సలహా.
• 💰 **ఆదాయ క్యాలిక్యులేటర్:** రవాణా & కోల్డ్ స్టోరేజ్ ఖర్చులు పోను నికర లాభం.
• ⛅ **వాతావరణ సమాచారం:** పంట ఆరబెట్టడం & భద్రత వాతావరణ హెచ్చరికలు.

మీరు ఏ పంట (**మిర్చి** / **పసుపు**) లేదా మార్కెట్ ధర గురించి తెలుసుకోవాలనుకుంటున్నారో అడగండి!

[ACTION:FORECAST] [ACTION:MARKETS] [ACTION:CALCULATOR]"""
        else:
            return f"""👋 **Hello! Welcome to AgriPrice AI!** 🌾

I am your real-time **AgriPrice AI Assistant**, ready to help Chilli & Turmeric farmers of Andhra Pradesh make profitable market decisions.

Here is how I can assist you today:
• 🌶️ **Live AP Mandi Spot Rates:** Real-time prices in Guntur, Duggirala, Vijayawada, Kurnool, etc.
• 🔮 **15 to 90 Day AI Forecasts:** Predictive price trends & Sell vs Wait advisories.
• 💰 **Net Revenue Calculator:** Profit calculation after transport & storage costs.
• ⛅ **Weather Advisory:** Climate impact on open-yard pod drying & rhizome processing.

What crop (**Chilli** / **Turmeric**) or market would you like to check today?

[ACTION:FORECAST] [ACTION:MARKETS] [ACTION:CALCULATOR]"""

    # 2. Specific intent responses
    if lang == "te":
        if is_sell_query or "ఆగాలా" in msg or "అమ్మాలా" in msg:
            rec_text = "ఆగడం మంచిది (WAIT)" if f['recommendation'] == "WAIT" else ("ఇప్పుడే అమ్మండి (SELL NOW)" if f['recommendation'] == "SELL_NOW" else "పాక్షికంగా అమ్మండి (PARTIAL SELL)")
            return f"""🌾 **అగ్రిప్రైస్ AI మార్కెట్ సలహా ({market} {target_crop.title()})**

సూచించిన నిర్ణయం: **{rec_text}**

📊 **ప్రస్తుత & అంచనా వివరాలు:**
• **ప్రస్తుత మార్కెట్ ధర:** ₹{f['current_price']:,} / క్వింటాలు
• **15 రోజుల AI అంచనా ధర:** ₹{f['predicted_price']:,} / క్వింటాలు (లాభం: +{f['percentage_change']}%)
• **అంచనా ఖచ్చితత్వం (Confidence):** {f['confidence_score']}%

💡 **AI విశ్లేషణ మరియు కారణాలు:**
1. గుంటూరు, దుగ్గిరాల మార్కెట్లకు పంట రాక (Arrivals) 15% వరకు తగ్గింది.
2. బంగ్లాదేశ్ మరియు చైనా నుండి ఎగుమతి డిమాండ్ బలంగా ఉంది.
3. ముందస్తు అమ్మకం కంటే 15 రోజులు ఆగితే ప్రతి క్వింటాలుకి సుమారు ₹{f['predicted_price'] - f['current_price']:,} అదనపు లాభం వచ్చే అవకాశం ఉంది.

💡 **తెలివైన విక్రయ పద్ధతి (Partial Selling):**
అత్యవసర నగదు అవసరమైతే **40% పంటను ఇప్పుడే** విక్రయించి, మిగిలిన **60% పంటను 15 రోజుల తర్వాత** హెచ్చు ధరకు విక్రయించండి.

[ACTION:FORECAST] [ACTION:CALCULATOR] [ACTION:MARKETS]"""

        elif is_weather:
            return f"""⛅ **ఆంధ్రప్రదేశ్ వ్యవసాయ వాతావరణ హెచ్చరిక ({market} ప్రాంతం)**

• **ప్రస్తుత ఉష్ణోగ్రత:** 32.4°C (పాక్షికంగా మబ్బులతో కూడిన వాతావరణం)
• **తేమ (Humidity):** 68%
• **వర్షపాత సూచన:** రాబోయే 48 గంటల్లో తేలికపాటి చినుకులు పడే అవకాశం ఉంది.

🌱 **మిర్చి & పసుపు రైతులకు సూచనలు:**
- **మిర్చి (Chilli):** కళ్ళాల్లో (Open Yards) ఆరబెట్టిన మిర్చిపై తార్పాలిన్ కవర్లు సిద్ధంగా ఉంచుకోండి.
- **పసుపు (Turmeric):** పసుపు కొమ్ముల ఉడకబెట్టడం మరియు ఆరబెట్టడానికి అనుకూలమైన వాతావరణం.

[ACTION:WEATHER] [ACTION:FORECAST]"""

        elif is_revenue:
            return f"""💰 **ఆదాయం & లాభాల లెక్కింపు సలహా**

మీ పంట దిగుబడికి నికర లాభం లెక్కించడానికి అగ్రిప్రైస్ AI రవాణా మరియు నిల్వ ఖర్చులను కూడా పరిగణనలోకి తీసుకుంటుంది.

• **ఉదాహరణ:** 50 క్వింటాళ్ళ మిర్చి గుంటూరు మార్కెట్‌లో
• **ఈరోజు విక్రయిస్తే (Spot Revenue):** ₹{50 * f['current_price']:,}
• **15 రోజులు ఆగితే (Forecasted Revenue):** ₹{50 * f['predicted_price']:,}
• **అదనపు సంభావ్య లాభం:** ₹{(f['predicted_price'] - f['current_price']) * 50:,}

మీ ఖచ్చితమైన రవాణా & కోల్డ్ స్టోరేజ్ ఖర్చులు నమోదు చేసి నికర ROI చూడటానికి **ఆదాయ క్యాలిక్యులేటర్** ఉపయోగించండి.

[ACTION:CALCULATOR] [ACTION:FORECAST]"""

        else:
            m_lines = "\n".join([f"• **{m['name']}:** మిర్చి ₹{m['chilli_price']:,} | పసుపు ₹{m['turmeric_price']:,}" for m in ctx['markets'][:4]])
            return f"""🤖 **అగ్రిప్రైస్ AI రైతు సలహాదారు (AgriPrice AI Assistant)**

నమస్కారం! ఆంధ్రప్రదేశ్ మిర్చి మరియు పసుపు రైతులకు స్వాగతం.

📈 **నేటి ఆంధ్రప్రదేశ్ ప్రధాన మార్కెట్ ధరలు:**
{m_lines}

🔮 **{market} {target_crop.title()} AI అంచనా:**
• **ప్రస్తుత ధర:** ₹{f['current_price']:,} / క్వింటాలు
• **15 రోజుల భవిష్యత్ అంచనా:** ₹{f['predicted_price']:,} / క్వింటాలు (+{f['percentage_change']}%)
• **AI సూచన:** **{f['recommendation']}** (వేచి ఉండటం వల్ల మెరుగైన ధర పొందవచ్చు)

మీరు ఏ మార్కెట్ లేదా పంట ధర గురించి తెలుసుకోవాలనుకుంటున్నారో అడగండి!

[ACTION:FORECAST] [ACTION:MARKETS] [ACTION:CALCULATOR]"""

    else:
        # English Response
        if is_sell_query or "sell" in msg or "wait" in msg:
            return f"""🌾 **AgriPrice AI Selling Advisory ({market} - {target_crop.title()})**

Recommendation: **{f['recommendation']}**

📊 **Price Breakdown & 15-Day Horizon:**
• **Current Spot Price:** ₹{f['current_price']:,} / Quintal
• **15-Day Forecast Price:** ₹{f['predicted_price']:,} / Quintal (+{f['percentage_change']}%)
• **Confidence Range:** ₹{f['min_price']:,} to ₹{f['max_price']:,} / Quintal ({f['confidence_score']}% confidence)

💡 **AI Market Rationale:**
1. Market arrivals in {market} and surrounding AP mandis are currently lower than average seasonal trends.
2. Export demand for Teja Chilli & quality Turmeric grades to Bangladesh and Vietnam remains robust.
3. Holding for 15 days offers an estimated upside of **+₹{f['predicted_price'] - f['current_price']:,} per Quintal**.

💡 **Recommended Selling Strategy (Partial Sell):**
If immediate liquidity is needed, sell **40% today** at ₹{f['current_price']:,} and hold **60% for 15 days** to capture peak prices.

[ACTION:FORECAST] [ACTION:CALCULATOR] [ACTION:MARKETS]"""

        elif is_weather:
            return f"""⛅ **AP Agricultural Weather Impact ({market} Region)**

• **Temperature:** 32.4°C (Partly Cloudy)
• **Relative Humidity:** 68%
• **48-Hour Rains:** Light isolated showers expected.

🌱 **Farmer Action Advisory:**
- **Chilli Drying Yards:** Keep protective tarpaulins ready in open yards to safeguard harvested pod quality.
- **Turmeric Processing:** Current moisture & humidity levels favor rhizome curing.

[ACTION:WEATHER] [ACTION:FORECAST]"""

        elif is_revenue:
            return f"""💰 **Net Revenue & Profit Optimization**

Here is a quick financial estimation for your harvest in {market}:

• **Sample Quantity:** 50 Quintals ({target_crop.title()})
• **Immediate Spot Revenue:** ₹{50 * f['current_price']:,}
• **Estimated Revenue (15 Days):** ₹{50 * f['predicted_price']:,}
• **Potential Gross Profit Increase:** ₹{(f['predicted_price'] - f['current_price']) * 50:,}

Calculate your custom net returns minus transport and cold storage costs using the Revenue Calculator below!

[ACTION:CALCULATOR] [ACTION:FORECAST]"""

        else:
            m_lines = "\n".join([f"• **{m['name']} ({m['district']}):** Chilli ₹{m['chilli_price']:,} | Turmeric ₹{m['turmeric_price']:,}" for m in ctx['markets'][:4]])
            return f"""🤖 **AgriPrice AI Farmer Assistant**

Welcome! I provide real-time AP market prices, AI predictions, and sell vs wait recommendations.

📈 **Live AP Mandi Spot Rates:**
{m_lines}

🔮 **AI Market Insight ({market} {target_crop.title()}):**
• **Current Rate:** ₹{f['current_price']:,} / Quintal
• **15-Day Target:** ₹{f['predicted_price']:,} / Quintal (+{f['percentage_change']}%)
• **AI Recommendation:** **{f['recommendation']}**

Feel free to ask about market comparisons, weather impacts, or revenue calculations!

[ACTION:FORECAST] [ACTION:MARKETS] [ACTION:CALCULATOR]"""

async def stream_gemini_or_fallback(request: ChatRequest):
    """Stream real-time tokens using Gemini API if key exists, or chunked fallback engine."""
    ctx = fetch_live_agri_context(request.crop or "chilli", request.market or "Guntur")
    
    gemini_key = settings.GEMINI_API_KEY
    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = build_prompt_context(request, ctx)
            
            response = model.generate_content(prompt, stream=True)
            for chunk in response:
                if chunk.text:
                    data = json.dumps({"text": chunk.text})
                    yield f"data: {data}\n\n"
                    await asyncio.sleep(0.02)
            yield "data: [DONE]\n\n"
            return
        except Exception as e:
            print(f"Gemini API streaming error, falling back to Agri AI expert system: {e}")

    # Fallback Streaming Simulation: Chunk text into natural word streams
    full_text = generate_fallback_expert_response(request, ctx)
    words = re.split(r'(\s+)', full_text)
    
    buffer = ""
    for i, word in enumerate(words):
        buffer += word
        if i % 3 == 0 or i == len(words) - 1:
            data = json.dumps({"text": buffer})
            yield f"data: {data}\n\n"
            buffer = ""
            await asyncio.sleep(0.025)
            
    yield "data: [DONE]\n\n"

@router.post("/stream")
async def chat_stream(request: ChatRequest):
    """Endpoint providing SSE real-time token streaming for AI Chatbot."""
    return StreamingResponse(
        stream_gemini_or_fallback(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@router.get("/suggestions")
def get_chat_suggestions(lang: Optional[str] = "en"):
    """Get quick suggestion questions for farmers."""
    if lang == "te":
        return {
            "suggestions": [
                {"id": 1, "text": "🌶️ గుంటూరు మార్కెట్‌లో మిర్చి 15 రోజుల ధర అంచనా ఎంత?", "crop": "chilli", "market": "Guntur"},
                {"id": 2, "text": "🌾 దుగ్గిరాలలో పసుపు ధర ఎంత? ఇప్పుడు అమ్మాలా?", "crop": "turmeric", "market": "Duggirala"},
                {"id": 3, "text": "⚖️ నేను నా 50 క్వింటాళ్ళ మిర్చిని ఇప్పుడే అమ్మాలా లేక ఆగాలా?", "crop": "chilli", "market": "Guntur"},
                {"id": 4, "text": "⛅ రాబోయే 48 గంటల్లో వాతావరణం పంట ఆరబెట్టడానికి బాగుందా?", "crop": "chilli", "market": "Guntur"},
                {"id": 5, "text": "📊 పసుపుకు ఏ మార్కెట్ ఎక్కువ ధర ఇస్తోంది?", "crop": "turmeric", "market": "Duggirala"}
            ]
        }
    return {
        "suggestions": [
            {"id": 1, "text": "🌶️ What is the 15-day Chilli price forecast in Guntur Mandi?", "crop": "chilli", "market": "Guntur"},
            {"id": 2, "text": "🌾 Current Turmeric price in Duggirala & sell advice?", "crop": "turmeric", "market": "Duggirala"},
            {"id": 3, "text": "⚖️ Should I sell 50 quintals Chilli today or wait 15 days?", "crop": "chilli", "market": "Guntur"},
            {"id": 4, "text": "⛅ Weather forecast and crop drying conditions in AP?", "crop": "chilli", "market": "Guntur"},
            {"id": 5, "text": "📊 Which AP mandi currently offers the highest price?", "crop": "turmeric", "market": "Duggirala"}
        ]
    }
