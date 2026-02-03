import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Utensils, ShoppingBag, Settings, LogOut, Plus, Edit, Trash2, Loader2, Users } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { api } from "@shared/routes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  available: boolean;
};

const defaultFormData: ProductFormData = {
  name: "",
  description: "",
  price: "",
  category: "Signatures",
  imageUrl: "",
  available: true,
};

export default function MenuManagement() {
  const { user, isLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: [api.products.list.path],
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      available: product.available,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.imageUrl) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, data: formData });
        toast({ title: "Product updated successfully" });
      } else {
        await createProduct.mutateAsync(formData);
        toast({ title: "Product created successfully" });
      }
      setIsModalOpen(false);
      setFormData(defaultFormData);
    } catch (error: any) {
      toast({ title: error.message || "Operation failed", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;
    try {
      await deleteProduct.mutateAsync(deleteProductId);
      toast({ title: "Product deleted successfully" });
      setDeleteProductId(null);
    } catch (error: any) {
      toast({ title: error.message || "Failed to delete", variant: "destructive" });
    }
  };

  const toggleAvailability = async (product: Product) => {
    try {
      await updateProduct.mutateAsync({ id: product.id, data: { available: !product.available } });
      toast({ title: `${product.name} is now ${product.available ? "unavailable" : "available"}` });
    } catch (error: any) {
      toast({ title: "Failed to update availability", variant: "destructive" });
    }
  };

  if (isLoading || !user || user.role !== "admin") return null;

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-primary">Infusion Admin</h1>
        </div>

        <nav className="flex-grow space-y-2">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/admin/menu">
            <Button variant="ghost" className="w-full justify-start gap-3 bg-accent/50">
              <Utensils className="w-4 h-4" /> Menu Items
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <ShoppingBag className="w-4 h-4" /> Orders
            </Button>
          </Link>
          <Link href="/admin/customers">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Users className="w-4 h-4" /> Customers
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Settings className="w-4 h-4" /> Settings
            </Button>
          </Link>
        </nav>

        <Button variant="ghost" className="mt-auto justify-start gap-3 text-destructive" onClick={() => logout()}>
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Menu Management</h2>
            <p className="text-muted-foreground">Add, edit or remove items from your menu.</p>
          </div>
          <Button className="gap-2" onClick={openAddModal}>
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </header>

        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">Loading items...</TableCell>
                </TableRow>
              ) : products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>
                    <button onClick={() => toggleAvailability(product)}>
                      {product.available ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 cursor-pointer hover:bg-green-500/20">Available</Badge>
                      ) : (
                        <Badge variant="destructive" className="cursor-pointer hover:bg-destructive/80">Sold Out</Badge>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteProductId(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Product name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Signatures">Signatures</SelectItem>
                    <SelectItem value="Sides">Sides</SelectItem>
                    <SelectItem value="Beverages">Beverages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL *</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
              />
              {formData.imageUrl && (
                <img src={formData.imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded mt-2" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
              <Label htmlFor="available">Available for order</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createProduct.isPending || updateProduct.isPending}>
              {(createProduct.isPending || updateProduct.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingProduct ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteProduct.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
