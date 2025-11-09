from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    category: str  # sensorial, afetivo, ritualistico
    price: float
    image_url: str

class Kit(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    tier: str  # xodo, encanto, completo
    description: str
    price_min: float
    price_max: Optional[float] = None
    items: List[str]  # product ids
    image_url: str

class QuizAnswer(BaseModel):
    recipient: str
    moment: str
    feeling: str

class RitualSuggestion(BaseModel):
    ritual_name: str
    suggested_products: List[Product]
    categories: dict

class OrderItem(BaseModel):
    product_id: str
    product_name: str
    price: float

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ritual_name: str
    items: List[OrderItem]
    total: float
    dedication: Optional[str] = None
    delivery_address: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    ritual_name: str
    items: List[OrderItem]
    dedication: Optional[str] = None
    delivery_address: str

# Initialize sample data
@app.on_event("startup")
async def startup_event():
    # Check if data already exists
    existing_products = await db.products.count_documents({})
    if existing_products == 0:
        # Sample Products
        products = [
            # Sensorial
            {"id": "p1", "name": "Vela Aromática de Lavanda", "description": "Vela artesanal com aroma suave de lavanda", "category": "sensorial", "price": 45.0, "image_url": "https://images.unsplash.com/photo-1602874801006-e24b6d717e8e?w=400"},
            {"id": "p2", "name": "Chá de Camomila Premium", "description": "Blend especial para momentos de calma", "category": "sensorial", "price": 32.0, "image_url": "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400"},
            {"id": "p3", "name": "Óleo Essencial de Bergamota", "description": "Para aromatizar e relaxar", "category": "sensorial", "price": 58.0, "image_url": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400"},
            {"id": "p4", "name": "Incenso Natural Sândalo", "description": "Incensos artesanais purificadores", "category": "sensorial", "price": 28.0, "image_url": "https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=400"},
            # Afetivo
            {"id": "p5", "name": "Cristal Quartzo Rosa", "description": "Pedra do amor e autocuidado", "category": "afetivo", "price": 42.0, "image_url": "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=400"},
            {"id": "p6", "name": "Amuleto da Lua", "description": "Pingente simbólico para conexão", "category": "afetivo", "price": 68.0, "image_url": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400"},
            {"id": "p7", "name": "Coração de Argila", "description": "Objeto simbólico feito à mão", "category": "afetivo", "price": 35.0, "image_url": "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400"},
            {"id": "p8", "name": "Mandala de Proteção", "description": "Arte decorativa com significado", "category": "afetivo", "price": 52.0, "image_url": "https://images.unsplash.com/photo-1582747652681-7c0e6a5ec14c?w=400"},
            # Ritualístico
            {"id": "p9", "name": "Cartas de Afirmação", "description": "50 cartas com mensagens de amor", "category": "ritualistico", "price": 48.0, "image_url": "https://images.unsplash.com/photo-1611195974226-ef4f6ab4b4bf?w=400"},
            {"id": "p10", "name": "Diário de Gratidão", "description": "Para registrar momentos especiais", "category": "ritualistico", "price": 55.0, "image_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"},
            {"id": "p11", "name": "Guia do Ritual de Lua Nova", "description": "Manual ilustrado para rituais lunares", "category": "ritualistico", "price": 38.0, "image_url": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"},
            {"id": "p12", "name": "Kit de Meditação", "description": "Guia completo para práticas diárias", "category": "ritualistico", "price": 62.0, "image_url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400"},
        ]
        await db.products.insert_many(products)
        
        # Sample Kits
        kits = [
            {
                "id": "k1",
                "name": "Kit Xodó",
                "tier": "xodo",
                "description": "Ritual essencial para demonstrar carinho e afeto",
                "price_min": 88.0,
                "price_max": 88.0,
                "items": ["p2", "p7"],
                "image_url": "https://images.unsplash.com/photo-1759563876829-47c081a2afd9?w=600"
            },
            {
                "id": "k2",
                "name": "Kit Encanto",
                "tier": "encanto",
                "description": "Ritual completo de conexão e presença",
                "price_min": 160.0,
                "price_max": 250.0,
                "items": ["p1", "p5", "p9", "p2"],
                "image_url": "https://images.unsplash.com/photo-1759563874670-9ccc048192ee?w=600"
            },
            {
                "id": "k3",
                "name": "Kit Ritual Completo",
                "tier": "completo",
                "description": "Experiência transformadora de amor e cuidado",
                "price_min": 300.0,
                "price_max": 340.0,
                "items": ["p1", "p3", "p6", "p9", "p10", "p11"],
                "image_url": "https://images.unsplash.com/photo-1759563871370-692ab3de97ed?w=600"
            }
        ]
        await db.kits.insert_many(kits)

# Routes
@api_router.get("/")
async def root():
    return {"message": "Xodózin API - Rituais de Presente"}

@api_router.get("/products", response_model=List[Product])
async def get_products():
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    return products

@api_router.get("/products/category/{category}", response_model=List[Product])
async def get_products_by_category(category: str):
    products = await db.products.find({"category": category}, {"_id": 0}).to_list(1000)
    return products

@api_router.get("/kits", response_model=List[Kit])
async def get_kits():
    kits = await db.kits.find({}, {"_id": 0}).to_list(1000)
    return kits

@api_router.post("/quiz/suggest", response_model=RitualSuggestion)
async def get_ritual_suggestion(answers: QuizAnswer):
    # Logic to suggest products based on answers
    ritual_names = {
        "parceiro": "Ritual do Amor",
        "amigo": "Ritual da Amizade",
        "familia": "Ritual do Aconchego",
        "proprio": "Ritual do Autocuidado"
    }
    
    ritual_name = ritual_names.get(answers.recipient, "Ritual Especial")
    
    # Get products from each category
    sensorial = await db.products.find({"category": "sensorial"}, {"_id": 0}).to_list(3)
    afetivo = await db.products.find({"category": "afetivo"}, {"_id": 0}).to_list(3)
    ritualistico = await db.products.find({"category": "ritualistico"}, {"_id": 0}).to_list(3)
    
    all_products = sensorial + afetivo + ritualistico
    
    return {
        "ritual_name": ritual_name,
        "suggested_products": all_products,
        "categories": {
            "sensorial": len(sensorial),
            "afetivo": len(afetivo),
            "ritualistico": len(ritualistico)
        }
    }

@api_router.post("/orders", response_model=Order)
async def create_order(order_input: OrderCreate):
    order = Order(
        ritual_name=order_input.ritual_name,
        items=order_input.items,
        total=sum(item.price for item in order_input.items),
        dedication=order_input.dedication,
        delivery_address=order_input.delivery_address
    )
    
    doc = order.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.orders.insert_one(doc)
    return order

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if isinstance(order['created_at'], str):
        order['created_at'] = datetime.fromisoformat(order['created_at'])
    
    return order

# Include the router in the main app
app.include_router(api_router)

# Configure CORS
cors_origins = os.environ.get('CORS_ORIGINS', '*')
# Remove espaços e filtra valores vazios
if cors_origins == '*':
    allowed_origins = ['*']
else:
    allowed_origins = [origin.strip() for origin in cors_origins.split(',') if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()