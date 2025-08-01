import React, { useState, useEffect } from "react";
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Warehouse,
  DollarSign,
  Tag
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  categoryId: "",
  artisan: "",
  emoji: "🎨",
  stockQuantity: "",
  isActive: true,
};

const ManageProducts = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      console.log('Fetching products and categories...');
      const [productsRes, categoriesRes] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);

      console.log('Products response:', productsRes);
      console.log('Categories response:', categoriesRes);

      if (productsRes.success) {
        setProducts(productsRes.products || []);
      } else {
        console.error('Failed to fetch products:', productsRes);
        setProducts([]);
      }

      if (categoriesRes.success) {
        setCategories(categoriesRes.categories || []);
      } else {
        console.error('Failed to fetch categories:', categoriesRes);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingProduct(null);
    setShowAddDialog(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        originalPrice: parseFloat(form.originalPrice) || parseFloat(form.price),
        categoryId: parseInt(form.categoryId),
        artisan: form.artisan,
        emoji: form.emoji,
        stockQuantity: parseInt(form.stockQuantity),
        isActive: form.isActive,
      };

      console.log('Submitting product data:', productData);

      let response;
      if (editingProduct) {
        response = await api.updateProduct(editingProduct.id, productData);
      } else {
        response = await api.createProduct(productData);
      }

      console.log('Product submission response:', response);

      if (response.success) {
        toast({
          title: "Success",
          description: editingProduct ? "Product updated successfully" : "Product created successfully",
        });
        resetForm();
        fetchData(); // Refresh the products list
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to save product",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Something went wrong while saving the product",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || product.price.toString(),
      categoryId: product.categoryId?.toString() || "",
      artisan: product.artisan || "",
      emoji: product.emoji || "🎨",
      stockQuantity: product.stockQuantity?.toString() || "0",
      isActive: product.isActive !== false,
    });
    setEditingProduct(product);
    setShowAddDialog(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await api.deleteProduct(productId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
        fetchData(); // Refresh the products list
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete product",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Something went wrong while deleting the product",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.artisan || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || 
      product.categoryId?.toString() === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (quantity < 10) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-lg">Loading products...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Product Management
          </h1>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventory" className="flex items-center space-x-2">
              <Warehouse className="w-4 h-4" />
              <span>Inventory Management</span>
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </TabsTrigger>
          </TabsList>

          {/* Inventory Management Tab */}
          <TabsContent value="inventory" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search products by name or artisan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Products ({filteredProducts.length})</span>
                  <Button onClick={fetchData} variant="outline" size="sm">
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No products found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => {
                          const stockStatus = getStockStatus(product.stockQuantity || 0);
                          return (
                            <TableRow key={product.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <span className="text-2xl">{product.emoji || '🎨'}</span>
                                  <div>
                                    <div className="font-medium">{product.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      by {product.artisan || 'Unknown'}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">Rs {product.price?.toLocaleString()}</div>
                                  {product.originalPrice && product.originalPrice !== product.price && (
                                    <div className="text-sm text-muted-foreground line-through">
                                      Rs {product.originalPrice.toLocaleString()}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{product.stockQuantity || 0}</div>
                                  <Badge variant="outline" className={stockStatus.color}>
                                    {stockStatus.label}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={product.isActive !== false ? "default" : "secondary"}>
                                  {product.isActive !== false ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(product)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(product.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Product Tab */}
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Add New Product</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProductForm
                  form={form}
                  categories={categories}
                  onInputChange={handleInputChange}
                  onSelectChange={handleSelectChange}
                  onSubmit={handleSubmit}
                  onReset={resetForm}
                  loading={formLoading}
                  isEditing={false}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add/Edit Product Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              form={form}
              categories={categories}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onSubmit={handleSubmit}
              onReset={resetForm}
              loading={formLoading}
              isEditing={!!editingProduct}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

// Product Form Component
const ProductForm = ({ 
  form, 
  categories, 
  onInputChange, 
  onSelectChange, 
  onSubmit, 
  onReset, 
  loading, 
  isEditing 
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={onInputChange}
          placeholder="Enter product name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="emoji">Emoji</Label>
        <Input
          id="emoji"
          name="emoji"
          value={form.emoji}
          onChange={onInputChange}
          placeholder="🎨"
          maxLength={2}
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        name="description"
        value={form.description}
        onChange={onInputChange}
        placeholder="Enter product description"
        rows={3}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="price">Price (Rs) *</Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={form.price}
          onChange={onInputChange}
          placeholder="0"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="originalPrice">Original Price (Rs)</Label>
        <Input
          id="originalPrice"
          name="originalPrice"
          type="number"
          value={form.originalPrice}
          onChange={onInputChange}
          placeholder="0"
          min="0"
          step="0.01"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category</Label>
        <Select value={form.categoryId} onValueChange={(value) => onSelectChange('categoryId', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="artisan">Artisan</Label>
        <Input
          id="artisan"
          name="artisan"
          value={form.artisan}
          onChange={onInputChange}
          placeholder="Enter artisan name"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="stockQuantity">Stock Quantity *</Label>
        <Input
          id="stockQuantity"
          name="stockQuantity"
          type="number"
          value={form.stockQuantity}
          onChange={onInputChange}
          placeholder="0"
          min="0"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="isActive">Product Status</Label>
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            name="isActive"
            checked={form.isActive}
            onCheckedChange={(checked) => onSelectChange('isActive', checked)}
          />
          <Label htmlFor="isActive">
            {form.isActive ? "Active" : "Inactive"}
          </Label>
        </div>
      </div>
    </div>

    <div className="flex justify-end space-x-4">
      <Button type="button" variant="outline" onClick={onReset}>
        <X className="w-4 h-4 mr-2" />
        Cancel
      </Button>
      <Button type="submit" disabled={loading}>
        <Save className="w-4 h-4 mr-2" />
        {loading ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
      </Button>
    </div>
  </form>
);

export default ManageProducts;
