import menuService from './MenuService';

const foodItemService = {
  // Get all food items (same as menus)
  getAllFoodItems: () => {
    return menuService.getAllMenus();
  },

  // Get food item by ID
  getFoodItemById: (id) => {
    return menuService.getMenuById(id);
  },

  // Create new food item
  createFoodItem: (foodItemData) => {
    return menuService.createMenu(foodItemData);
  },

  // Update food item
  updateFoodItem: (id, foodItemData) => {
    return menuService.updateMenu(id, foodItemData);
  },

  // Delete food item
  deleteFoodItem: (id) => {
    return menuService.deleteMenu(id);
  },

  // Toggle food item availability
  toggleFoodItemAvailability: (id) => {
    return menuService.toggleActive(id);
  }
};

export default foodItemService;