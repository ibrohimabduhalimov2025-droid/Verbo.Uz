import json
import re

# Comprehensive list of realistic Unsplash photos for tangible concrete words
# All URLs use high-resolution, fast-loading, optimized parameters (w=600&q=80)
PHOTO_MAP = {
  # === Hayvonlar (Animals) ===
  'dog': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
  'dogs': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
  'puppy': 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=600&q=80',
  'cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
  'cats': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
  'kitten': 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80',
  'cow': 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=600&q=80',
  'cows': 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=600&q=80',
  'calf': 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80',
  'bull': 'https://images.unsplash.com/photo-1551085254-e96b210df58a?auto=format&fit=crop&w=600&q=80',
  'horse': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
  'horses': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
  'sheep': 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=600&q=80',
  'lamb': 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80',
  'goat': 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=600&q=80',
  'pig': 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
  'donkey': 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=600&q=80',
  'lion': 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=600&q=80',
  'tiger': 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80',
  'leopard': 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?auto=format&fit=crop&w=600&q=80',
  'cheetah': 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
  'elephant': 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=600&q=80',
  'monkey': 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=600&q=80',
  'gorilla': 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=600&q=80',
  'bear': 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=600&q=80',
  'polar bear': 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=600&q=80',
  'wolf': 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&w=600&q=80',
  'wolves': 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&w=600&q=80',
  'fox': 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=600&q=80',
  'rabbit': 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80',
  'hare': 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80',
  'mouse': 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80',
  'rat': 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80',
  'deer': 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80',
  'camel': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
  'zebra': 'https://images.unsplash.com/photo-1526095179574-86e545346ae6?auto=format&fit=crop&w=600&q=80',
  'giraffe': 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=600&q=80',
  'kangaroo': 'https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?auto=format&fit=crop&w=600&q=80',
  'panda': 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=600&q=80',
  'koala': 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=600&q=80',
  'squirrel': 'https://images.unsplash.com/photo-1507667522043-353ba9b407ef?auto=format&fit=crop&w=600&q=80',
  'hedgehog': 'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?auto=format&fit=crop&w=600&q=80',
  'bat': 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80',
  'snake': 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?auto=format&fit=crop&w=600&q=80',
  'turtle': 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=600&q=80',
  'tortoise': 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=600&q=80',
  'lizard': 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?auto=format&fit=crop&w=600&q=80',
  'frog': 'https://images.unsplash.com/photo-1496070242169-b672c576566b?auto=format&fit=crop&w=600&q=80',
  'crocodile': 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80',
  'alligator': 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80',
  'hippopotamus': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
  'hippo': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
  'rhinoceros': 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=600&q=80',
  'rhino': 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=600&q=80',

  # Qushlar (Birds)
  'bird': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=600&q=80',
  'birds': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=600&q=80',
  'eagle': 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=600&q=80',
  'owl': 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80',
  'duck': 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
  'chicken': 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80',
  'rooster': 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=600&q=80',
  'parrot': 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80',
  'swan': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  'penguin': 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=600&q=80',
  'dove': 'https://images.unsplash.com/photo-1520638023775-6b8bb47a4ec9?auto=format&fit=crop&w=600&q=80',
  'pigeon': 'https://images.unsplash.com/photo-1520638023775-6b8bb47a4ec9?auto=format&fit=crop&w=600&q=80',
  'peacock': 'https://images.unsplash.com/photo-1536514498073-50e69d1aef34?auto=format&fit=crop&w=600&q=80',
  'flamingo': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',

  # Suv jonzotlari & Hasharotlar
  'fish': 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80',
  'shark': 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=600&q=80',
  'whale': 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=600&q=80',
  'dolphin': 'https://images.unsplash.com/photo-1607153333879-c1a0c1445c78?auto=format&fit=crop&w=600&q=80',
  'crab': 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=600&q=80',
  'octopus': 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&w=600&q=80',
  'bee': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=600&q=80',
  'butterfly': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80',
  'ant': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  'spider': 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=600&q=80',

  # === Mevalar & Rezavorlar (Fruits) ===
  'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
  'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
  'orange': 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80',
  'lemon': 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=600&q=80',
  'grape': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
  'grapes': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
  'strawberry': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
  'watermelon': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
  'melon': 'https://images.unsplash.com/photo-1571575179703-4bde44fb4084?auto=format&fit=crop&w=600&q=80',
  'cherry': 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
  'peach': 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=600&q=80',
  'pear': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  'pineapple': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80',
  'pomegranate': 'https://images.unsplash.com/photo-1541344999736-83eca872f241?auto=format&fit=crop&w=600&q=80',
  'apricot': 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=600&q=80',
  'plum': 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=600&q=80',
  'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
  'kiwi': 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=600&q=80',
  'avocado': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',

  # === Sabzavotlar (Vegetables) ===
  'tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
  'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=600&q=80',
  'onion': 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=600&q=80',
  'garlic': 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80',
  'cucumber': 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=600&q=80',
  'corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
  'pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
  'mushroom': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
  'cabbage': 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=600&q=80',
  'pumpkin': 'https://images.unsplash.com/photo-1506917728037-b9bf01ac477b?auto=format&fit=crop&w=600&q=80',
  'eggplant': 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
  'broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80',

  # === Taomlar & Ichimliklar (Food & Drinks) ===
  'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  'cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80',
  'egg': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
  'meat': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
  'beef': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
  'sausage': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
  'steak': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
  'milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  'coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
  'tea': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
  'water': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
  'juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
  'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
  'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
  'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  'sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
  'cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
  'chocolate': 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80',
  'cookie': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
  'ice cream': 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80',
  'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  'honey': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',

  # === Uy, Mebel & Xonalar (Home & Furniture) ===
  'house': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80',
  'home': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  'door': 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=600&q=80',
  'window': 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80',
  'bed': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
  'table': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
  'chair': 'https://images.unsplash.com/photo-1580481077189-9a70f3f2d011?auto=format&fit=crop&w=600&q=80',
  'sofa': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
  'desk': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
  'mirror': 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80',
  'clock': 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80',
  'lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
  'key': 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
  'box': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
  'carpet': 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80',
  'curtain': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  'pillow': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',

  # === Kiyim-kechak (Clothing & Accessories) ===
  'shirt': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
  'jacket': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
  'coat': 'https://images.unsplash.com/photo-1539533018447-63fcce667883?auto=format&fit=crop&w=600&q=80',
  'dress': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
  'shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  'boots': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  'hat': 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=600&q=80',
  'cap': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80',
  'glasses': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
  'umbrella': 'https://images.unsplash.com/photo-1517865288-978fcb780650?auto=format&fit=crop&w=600&q=80',
  'ring': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
  'pants': 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80',
  'jeans': 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80',
  'suit': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
  'watch': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',

  # === Transport (Vehicles) ===
  'car': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80',
  'bus': 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80',
  'train': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=600&q=80',
  'airplane': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
  'plane': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80',
  'helicopter': 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
  'bicycle': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
  'bike': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
  'motorcycle': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
  'boat': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
  'ship': 'https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=600&q=80',
  'truck': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
  'taxi': 'https://images.unsplash.com/photo-1549194388-2469d59ec78c?auto=format&fit=crop&w=600&q=80',

  # === O‘quv qurollari & Texnika (Study & Tech) ===
  'book': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  'pen': 'https://images.unsplash.com/photo-1585336261026-41570529d20c?auto=format&fit=crop&w=600&q=80',
  'pencil': 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',
  'bag': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
  'backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
  'camera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
  'computer': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
  'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
  'phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  'television': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
  'tv': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
  'guitar': 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80',
  'piano': 'https://images.unsplash.com/photo-1520523839898-5071270503ab?auto=format&fit=crop&w=600&q=80',
  'scissors': 'https://images.unsplash.com/photo-1503792501406-2c40da09e1e2?auto=format&fit=crop&w=600&q=80',
  'hammer': 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80',
  'money': 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=600&q=80',

  # === Tabiat & Geografiya (Nature) ===
  'tree': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
  'flower': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80',
  'rose': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  'sun': 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=600&q=80',
  'moon': 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=600&q=80',
  'star': 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
  'mountain': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  'river': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
  'sea': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'ocean': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'lake': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'forest': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
  'rain': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
  'snow': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=600&q=80',

  # === Tana a’zolari (Body) ===
  'eye': 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
  'hand': 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=600&q=80',
  'heart': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
  'brain': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80',
  'face': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',

  # === Binolar & Joylar (Places) ===
  'school': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
  'hospital': 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80',
  'hotel': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
  'bank': 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=600&q=80',
  'restaurant': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
  'library': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
  'bridge': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
  'castle': 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=600&q=80',
  'park': 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80',
  'stadium': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
}

# High-resolution topic fallbacks for other concrete objects
TOPIC_PHOTOS = {
  'animals': 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=600&q=80',
  'birds': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=600&q=80',
  'marine': 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80',
  'fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
  'vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'food': 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
  'drinks': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
  'clothes': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
  'shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  'home': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  'furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
  'transport': 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80',
  'tech': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  'tools': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80',
  'study': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
  'nature': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
  'body': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
  'places': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
  'sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
  'music': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
}

abstract_suffixes = (
  'tion', 'sion', 'ment', 'ence', 'ance', 'ity', 'ness',
  'ism', 'ship', 'hood', 'logy', 'sis', 'phy', 'tude', 'cy',
  'dom', 'ry', 'ty'
)

def is_concrete_noun(word):
  pos = (word.get('partOfSpeech') or '').lower()
  clean = re.sub(r'\(.*?\)', '', word.get('english', '')).strip().lower()
  cat = (word.get('category') or '').lower()

  # 1. Strictly NO image for Verbs, Adjectives, Numbers, Adverbs, Prepositions, etc.
  if any(k in pos for k in ['fe’l', 'verb', 'sifat', 'adjective', 'son', 'number', 'ravish', 'adverb', 'predlog', 'bog‘lovchi', 'olmosh', 'undov', 'ibora']):
    return False

  # 2. Direct match in realistic photo dictionary
  if clean in PHOTO_MAP or (clean.endswith('s') and clean[:-1] in PHOTO_MAP):
    return True

  # 3. Must be noun (Ot)
  if 'ot' not in pos and 'noun' not in pos:
    return False

  # 4. Filter abstract suffixes
  if any(clean.endswith(s) for s in abstract_suffixes):
    return False

  # 5. Filter abstract categories
  if 'abstrakt' in cat or 'akademik' in cat or 'aqliy' in cat or 'grammatik' in cat:
    return False

  # 6. Tangible Uzbek markers
  uz = (word.get('uzbek') or '').lower()
  concrete_markers = [
    'hayvon', 'jonivor', 'it', 'mushuk', 'qush', 'baliq', 'ot', 'sigir', 'qo‘y', 'echki',
    'meva', 'sabzavot', 'olma', 'banan', 'non', 'taom', 'ichimlik', 'suv', 'choy', 'go‘sht',
    'buyum', 'jihoz', 'mebel', 'stol', 'stul', 'karavot', 'uy', 'eshik', 'deraza', 'quti',
    'kiyim', 'ko‘ylak', 'shim', 'poyabzal', 'tufli', 'bosh kiyim', 'etik', 'palto', 'sumka',
    'transport', 'mashina', 'avtomobil', 'avtobus', 'poyezd', 'samolyot', 'kema', 'velosiped',
    'tana a’zosi', 'bosh', 'ko‘z', 'quloq', 'burun', 'og‘iz', 'tish', 'qo‘l', 'oyoq', 'yurak', 'miya',
    'asbob', 'idish', 'qoshiq', 'pichoq', 'vilka', 'chashka', 'qalam', 'ruchka', 'kitob', 'daftar',
    'daraxt', 'gul', 'o‘simlik', 'quyosh', 'oy', 'yulduz', 'tog‘', 'daryo', 'ko‘l', 'dengiz',
    'telefon', 'kompyuter', 'kamera', 'soat', 'bino', 'maktab', 'shifoxona', 'ko‘prik', 'qal’a'
  ]
  if any(m in uz for m in concrete_markers):
    return True

  # 7. Concrete categories
  concrete_cats = [
    'tabiat, hayvonlar',
    'oziq-ovqat',
    'uy va mebel',
    'kiyim-kechak',
    'tana a’zolari',
    'joylar, transport',
    'sayohat va transport'
  ]
  if any(cc in cat for cc in concrete_cats):
    return True

  return False

def determine_photo_url(word):
  if not is_concrete_noun(word):
    return ''

  clean = re.sub(r'\(.*?\)', '', word.get('english', '')).strip().lower()
  clean_singular = clean[:-1] if clean.endswith('s') and len(clean) > 3 else clean

  # 1. Exact or singular match
  if clean in PHOTO_MAP:
    return PHOTO_MAP[clean]
  if clean_singular in PHOTO_MAP:
    return PHOTO_MAP[clean_singular]

  # 2. Semantic matching by category and keywords
  cat = (word.get('category') or '').lower()
  uz = (word.get('uzbek') or '').lower()

  if 'hayvon' in cat or 'qush' in uz or 'jonivor' in uz or 'parranda' in uz:
    return TOPIC_PHOTOS['animals']
  if 'baliq' in uz or 'dengiz' in uz or 'suv' in cat:
    return TOPIC_PHOTOS['marine']
  if 'meva' in uz or 'rezavor' in uz:
    return TOPIC_PHOTOS['fruits']
  if 'sabzavot' in uz or 'ildiz' in uz:
    return TOPIC_PHOTOS['vegetables']
  if 'oziq-ovqat' in cat or 'taom' in uz or 'ovqat' in uz or 'go‘sht' in uz:
    return TOPIC_PHOTOS['food']
  if 'ichimlik' in uz or 'choy' in uz or 'qahva' in uz or 'sharbat' in uz:
    return TOPIC_PHOTOS['drinks']
  if 'kiyim' in cat or 'kiyim' in uz or 'libos' in uz or 'ko‘ylak' in uz or 'shim' in uz:
    return TOPIC_PHOTOS['clothes']
  if 'poyabzal' in uz or 'etik' in uz or 'oyoq kiyim' in uz:
    return TOPIC_PHOTOS['shoes']
  if 'mebel' in cat or 'mebel' in uz or 'stol' in uz or 'stul' in uz or 'shkaf' in uz:
    return TOPIC_PHOTOS['furniture']
  if 'uy' in cat or 'uy' in uz or 'xona' in uz or 'eshik' in uz or 'deraza' in uz:
    return TOPIC_PHOTOS['home']
  if 'transport' in cat or 'mashina' in uz or 'avto' in uz or 'poyezd' in uz or 'kema' in uz:
    return TOPIC_PHOTOS['transport']
  if 'texnologiya' in cat or 'kompyuter' in uz or 'telefon' in uz or 'qurilma' in uz:
    return TOPIC_PHOTOS['tech']
  if 'asbob' in uz or 'qurol' in uz or 'pichoq' in uz or 'bolg‘a' in uz:
    return TOPIC_PHOTOS['tools']
  if 'ta’lim' in cat or 'maktab' in cat or 'kitob' in uz or 'daftar' in uz or 'qalam' in uz:
    return TOPIC_PHOTOS['study']
  if 'tana' in cat or 'a’zo' in uz or 'ko‘z' in uz or 'qo‘l' in uz or 'yurak' in uz:
    return TOPIC_PHOTOS['body']
  if 'joylar' in cat or 'bino' in uz or 'shifoxona' in uz or 'maktab' in uz or 'mehmonxona' in uz:
    return TOPIC_PHOTOS['places']
  if 'sport' in cat or 'sport' in uz or 'to‘p' in uz:
    return TOPIC_PHOTOS['sports']
  if 'musiqa' in uz or 'gitara' in uz or 'cholg‘u' in uz:
    return TOPIC_PHOTOS['music']
  if 'tabiat' in cat or 'daraxt' in uz or 'gul' in uz or 'tog‘' in uz:
    return TOPIC_PHOTOS['nature']

  return TOPIC_PHOTOS['nature']

files = [
  'public/data/cefr/a1.json',
  'public/data/cefr/a2.json',
  'public/data/cefr/b1.json',
  'public/data/cefr/b2.json',
  'public/data/cefr/c1.json',
  'public/data/cefr/c2.json',
  'public/data/cefr/starter_preview.json'
]

total_words = 0
total_with_photo = 0
total_without_photo = 0

for filepath in files:
  with open(filepath, 'r', encoding='utf-8') as f:
    words = json.load(f)

  for w in words:
    photo = determine_photo_url(w)
    w['image'] = photo
    total_words += 1
    if photo:
      total_with_photo += 1
    else:
      total_without_photo += 1

  with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(words, f, ensure_ascii=False, indent=2)

print('=== REALISTIC PHOTO UPDATE SUMMARY ===')
print(f'Total words processed: {total_words}')
print(f'Concrete objects with realistic photo: {total_with_photo}')
print(f'Words with NO photo (Sifat, Fe\'l, Son, Ravish, Abstrakt): {total_without_photo}')
