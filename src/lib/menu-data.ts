// src/lib/menu-data.ts

// Sample menu data with internationalization support

export const menuCategories = [
    {
      id: "appetizers",
      name: {
        en: "Appetizers",
        ar: "المقبلات",
      },
      description: {
        en: "Start your meal with something delicious",
        ar: "ابدأ وجبتك بشيء لذيذ",
      },
    },
    {
      id: "main-courses",
      name: {
        en: "Main Courses",
        ar: "الأطباق الرئيسية",
      },
      description: {
        en: "Our chef's special dishes",
        ar: "أطباق الشيف الخاصة",
      },
    },
    {
      id: "desserts",
      name: {
        en: "Desserts",
        ar: "الحلويات",
      },
      description: {
        en: "Sweet treats to finish your meal",
        ar: "حلويات لذيذة لإنهاء وجبتك",
      },
    },
    {
      id: "drinks",
      name: {
        en: "Drinks",
        ar: "المشروبات",
      },
      description: {
        en: "Refreshing beverages",
        ar: "مشروبات منعشة",
      },
    },
  ]
  
  export const menuItems = [
    {
      id: "1",
      name: { en: "Bruschetta", ar: "بروسكيتا" },
      description: { en: "Toasted bread topped with tomatoes, garlic, and basil", ar: "خبز محمص مع الطماطم والثوم والريحان" },
      price: 8.99, category: "appetizers", available: true,
    },
    {
      id: "2",
      name: { en: "Calamari", ar: "كالاماري" },
      description: { en: "Fried squid served with marinara sauce", ar: "حبار مقلي يقدم مع صلصة مارينارا" },
      price: 12.99, category: "appetizers", available: true,
    },
    {
      id: "3",
      name: { en: "Margherita Pizza", ar: "بيتزا مارجريتا" },
      description: { en: "Classic pizza with tomato sauce, mozzarella, and basil", ar: "بيتزا كلاسيكية مع صلصة الطماطم وجبنة الموزاريلا والريحان" },
      price: 14.99, category: "main-courses", available: true,
    },
    {
      id: "4",
      name: { en: "Spaghetti Carbonara", ar: "سباغيتي كاربونارا" },
      description: { en: "Pasta with eggs, cheese, pancetta, and black pepper", ar: "معكرونة مع البيض والجبن والبانسيتا والفلفل الأسود" },
      price: 16.99, category: "main-courses", available: true,
    },
    {
      id: "5",
      name: { en: "Tiramisu", ar: "تيراميسو" },
      description: { en: "Coffee-flavored Italian dessert", ar: "حلوى إيطالية بنكهة القهوة" },
      price: 7.99, category: "desserts", available: true,
    },
    {
      id: "6",
      name: { en: "Cheesecake", ar: "كعكة الجبن" },
      description: { en: "New York style cheesecake with berry compote", ar: "كعكة الجبن على طريقة نيويورك مع كومبوت التوت" },
      price: 8.99, category: "desserts", available: false,
    },
    {
      id: "7",
      name: { en: "Red Wine", ar: "نبيذ أحمر" },
      description: { en: "House red wine, glass", ar: "نبيذ أحمر منزلي، كأس" },
      price: 9.99, category: "drinks", available: true,
    },
    {
      id: "8",
      name: { en: "Sparkling Water", ar: "مياه فوارة" },
      description: { en: "Bottle of sparkling mineral water", ar: "زجاجة مياه معدنية فوارة" },
      price: 3.99, category: "drinks", available: true,
    },
    {
      id: "9",
      name: { en: "Chicken Parmesan", ar: "دجاج بارميزان" },
      description: { en: "Breaded chicken with tomato sauce and melted cheese", ar: "دجاج مغطى بالخبز المحمص مع صلصة الطماطم والجبن الذائب" },
      price: 18.99, category: "main-courses", available: true,
    },
    {
      id: "10",
      name: { en: "Caesar Salad", ar: "سلطة سيزر" },
      description: { en: "Romaine lettuce with Caesar dressing and croutons", ar: "خس روماني مع صلصة سيزر وقطع خبز محمص" },
      price: 10.99, category: "appetizers", available: true,
    },
    {
      id: "11",
      name: { en: "Chocolate Lava Cake", ar: "كعكة الشوكولاتة البركانية" },
      description: { en: "Warm chocolate cake with a molten center", ar: "كعكة شوكولاتة دافئة مع مركز منصهر" },
      price: 8.99, category: "desserts", available: true,
    },
    {
      id: "12",
      name: { en: "Iced Tea", ar: "شاي مثلج" },
      description: { en: "Freshly brewed iced tea with lemon", ar: "شاي مثلج طازج مع الليمون" },
      price: 3.99, category: "drinks", available: true,
    },
  ]