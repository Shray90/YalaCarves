import React, { useState, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";

const initialFormState = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  categoryId: "",
  artisan: "",
  emoji: "🎨",
  stockQuantity: "",
  image: null,
};

const ManageProducts = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ]);

        if (productsRes.success) {
          setProducts(productsRes.products);
        } else {
          toast({
            variant: "destructive",
            title: "Failed to fetch products",
          });
        }

        if (categoriesRes.success) {
          setCategories(categoriesRes.categories);
        } else {
          toast({
            variant: "destructive",
            title: "Failed to fetch categories",
          });
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error fetching data",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, toast]);

  if (!isAdmin) {
    return <div>Access denied. Admins only.</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image: file }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingProductId(null);
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || "",
      categoryId: product.categoryId || "",
      artisan: product.artisan,
      emoji: product.emoji || "🎨",
      stockQuantity: product.stock_quantity,
    });
  };

  const handleDeleteClick = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await api.deleteProduct(productId);
      if (res.success) {
        setProducts(products.filter((p) => p.id !== productId));
        toast({
          title: "Product deleted",
          variant: "default",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to delete product",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error deleting product",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    // Basic validation
    if (
      !form.name ||
      !form.description ||
      !form.price ||
      !form.categoryId ||
      !form.artisan ||
      form.stockQuantity === ""
    ) {
      toast({
        variant: "destructive",
        title: "Please fill in all required fields",
      });
      setFormLoading(false);
      return;
    }

    try {
      if (editingProductId) {
        // Update product
        const res = await api.updateProduct(editingProductId, {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
          categoryId: parseInt(form.categoryId),
          artisan: form.artisan,
          emoji: form.emoji,
          stockQuantity: parseInt(form.stockQuantity),
          image: form.image,
        });
        if (res.success) {
          setProducts(products.map((p) => (p.id === editingProductId ? res.product : p)));
          resetForm();
          toast({
            title: "Product updated",
            variant: "default",
          });
        } else {
          toast({
            variant: "destructive",
            title: res.error || "Failed to update product",
          });
        }
      } else {
        // Create product
        const res = await api.createProduct({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
          categoryId: parseInt(form.categoryId),
          artisan: form.artisan,
          emoji: form.emoji,
          stockQuantity: parseInt(form.stockQuantity),
          image: form.image,
        });
        if (res.success) {
          setProducts([...products, res.product]);
          resetForm();
          toast({
            title: "Product created",
            variant: "default",
          });
        } else {
          toast({
            variant: "destructive",
            title: res.error || "Failed to create product",
          });
        }
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error submitting form",
      });
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Manage Products</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingProductId ? "Edit Product" : "Add New Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <div>
              <Label htmlFor="name">Name*</Label>
              <Input id="name" name="name" value={form.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="description">Description*</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="price">Price* (Rs)</Label>
              <Input
                id="price"
                type="number"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="originalPrice">Original Price (Rs)</Label>
              <Input
                id="originalPrice"
                type="number"
                name="originalPrice"
                value={form.originalPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="categoryId">Category*</Label>
              <Select value={form.categoryId} onValueChange={(value) => setForm((prev) => ({ ...prev, categoryId: value }))} required>
                <SelectTrigger id="categoryId" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="artisan">Artisan*</Label>
              <Input id="artisan" name="artisan" value={form.artisan} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="emoji">Emoji</Label>
              <Input id="emoji" name="emoji" value={form.emoji} onChange={handleInputChange} maxLength={2} />
            </div>
            <div>
              <Label htmlFor="stockQuantity">Stock Quantity*</Label>
              <Input
                id="stockQuantity"
                type="number"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="image">Product Image</Label>
              <Input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="flex space-x-4">
              <Button type="submit" disabled={formLoading}>
                {editingProductId ? "Update Product" : "Add Product"}
              </Button>
              {editingProductId && (
                <Button variant="outline" type="button" onClick={resetForm} disabled={formLoading}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
      </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price (Rs)</TableHead>
            <TableHead>Stock Quantity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-16 h-16 object-cover rounded" />
                ) : (
                  <span>No Image</span>
                )}
              </TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.category_name || "Uncategorized"}</TableCell>
              <TableCell>{p.price}</TableCell>
              <TableCell>{p.stock_quantity}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => handleEditClick(p)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(p.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageProducts;
