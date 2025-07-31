import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Calendar, LogOut, Package, Heart, ShoppingBag, 
  Edit, Save, X, Plus, MapPin, Phone, Home, Building
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import apiService from "../services/api";
import { formatPrice } from "../utils/currency";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(null);
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [addressData, setAddressData] = useState({
    type: "shipping",
    label: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nepal",
    phone: "",
    isDefault: false
  });
  
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    
    loadUserData();
  }, [isAuthenticated, navigate]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const [profileResponse, addressesResponse, ordersResponse] = await Promise.all([
        apiService.getProfile(),
        apiService.request('/addresses'),
        apiService.getMyOrders()
      ]);

      setProfileData({
        name: profileResponse.user.name || "",
        email: profileResponse.user.email || "",
        phone: profileResponse.user.phone || ""
      });
      
      setAddresses(addressesResponse.addresses || []);
      setOrders(ordersResponse.orders || []);
    } catch (error) {
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      await apiService.updateProfile(profileData);
      setSuccess("Profile updated successfully");
      setIsEditingProfile(false);
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("New passwords do not match");
        return;
      }
      
      if (passwordData.newPassword.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      
      await apiService.updateProfile({
        newPassword: passwordData.newPassword,
        currentPassword: passwordData.currentPassword
      });
      
      setSuccess("Password updated successfully");
      setIsEditingPassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSave = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      if (isEditingAddress) {
        await apiService.request(`/addresses/${isEditingAddress}`, {
          method: 'PUT',
          body: JSON.stringify(addressData)
        });
        setSuccess("Address updated successfully");
      } else {
        await apiService.request('/addresses', {
          method: 'POST',
          body: JSON.stringify(addressData)
        });
        setSuccess("Address added successfully");
      }
      
      setIsAddingAddress(false);
      setIsEditingAddress(null);
      setAddressData({
        type: "shipping",
        label: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Nepal",
        phone: "",
        isDefault: false
      });
      
      await loadUserData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    try {
      await apiService.request(`/addresses/${addressId}`, { method: 'DELETE' });
      setSuccess("Address deleted successfully");
      await loadUserData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await apiService.request(`/addresses/${addressId}/set-default`, { method: 'PUT' });
      setSuccess("Default address updated");
      await loadUserData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const getInitials = (name) => {
    return name?.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Success/Error Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-wood-200 to-wood-300 text-wood-800">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-serif font-bold">{user.name}</h1>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Member since {new Date(user.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button onClick={handleLogout} variant="outline">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    {!isEditingProfile && (
                      <Button onClick={() => setIsEditingProfile(true)} variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingProfile ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input
                          value={profileData.email}
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          placeholder="+977 98XX-XXXXX"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleProfileSave} disabled={isLoading}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button onClick={() => setIsEditingProfile(false)} variant="outline">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <span>{profileData.name || "Not provided"}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span>{profileData.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span>{profileData.phone || "Not provided"}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Saved Addresses</CardTitle>
                    <Button onClick={() => setIsAddingAddress(true)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isAddingAddress || isEditingAddress ? (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <h3 className="font-medium">
                        {isEditingAddress ? "Edit Address" : "Add New Address"}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Type</label>
                          <Select 
                            value={addressData.type} 
                            onValueChange={(value) => setAddressData({...addressData, type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="shipping">Shipping</SelectItem>
                              <SelectItem value="billing">Billing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Label</label>
                          <Input
                            value={addressData.label}
                            onChange={(e) => setAddressData({...addressData, label: e.target.value})}
                            placeholder="Home, Office, etc."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Street Address</label>
                        <Input
                          value={addressData.streetAddress}
                          onChange={(e) => setAddressData({...addressData, streetAddress: e.target.value})}
                          placeholder="House number, street name"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">City</label>
                          <Input
                            value={addressData.city}
                            onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                            placeholder="City"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">State/Province</label>
                          <Input
                            value={addressData.state}
                            onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                            placeholder="State or Province"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Postal Code</label>
                          <Input
                            value={addressData.postalCode}
                            onChange={(e) => setAddressData({...addressData, postalCode: e.target.value})}
                            placeholder="Postal code"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Country</label>
                          <Input
                            value={addressData.country}
                            onChange={(e) => setAddressData({...addressData, country: e.target.value})}
                            placeholder="Country"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Phone Number</label>
                          <Input
                            value={addressData.phone}
                            onChange={(e) => setAddressData({...addressData, phone: e.target.value})}
                            placeholder="Phone number"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={addressData.isDefault}
                          onChange={(e) => setAddressData({...addressData, isDefault: e.target.checked})}
                        />
                        <label htmlFor="isDefault" className="text-sm">
                          Set as default {addressData.type} address
                        </label>
                      </div>

                      <div className="flex space-x-2">
                        <Button onClick={handleAddressSave} disabled={isLoading}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Address
                        </Button>
                        <Button 
                          onClick={() => {
                            setIsAddingAddress(false);
                            setIsEditingAddress(null);
                            setAddressData({
                              type: "shipping",
                              label: "",
                              streetAddress: "",
                              city: "",
                              state: "",
                              postalCode: "",
                              country: "Nepal",
                              phone: "",
                              isDefault: false
                            });
                          }} 
                          variant="outline"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No addresses saved yet. Add your first address to get started.
                        </p>
                      ) : (
                        addresses.map((address) => (
                          <div key={address.id} className="p-4 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {address.type === 'shipping' ? (
                                    <Home className="w-4 h-4 text-blue-600" />
                                  ) : (
                                    <Building className="w-4 h-4 text-green-600" />
                                  )}
                                  <span className="font-medium capitalize">
                                    {address.label || address.type}
                                  </span>
                                  {address.is_default && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <div className="text-gray-600">
                                  <p>{address.street_address}</p>
                                  <p>
                                    {address.city}
                                    {address.state && `, ${address.state}`}
                                    {address.postal_code && ` ${address.postal_code}`}
                                  </p>
                                  <p>{address.country}</p>
                                  {address.phone && <p>Phone: {address.phone}</p>}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                {!address.is_default && (
                                  <Button
                                    onClick={() => handleSetDefaultAddress(address.id)}
                                    size="sm"
                                    variant="outline"
                                  >
                                    Set Default
                                  </Button>
                                )}
                                <Button
                                  onClick={() => {
                                    setIsEditingAddress(address.id);
                                    setAddressData({
                                      type: address.type,
                                      label: address.label || "",
                                      streetAddress: address.street_address,
                                      city: address.city,
                                      state: address.state || "",
                                      postalCode: address.postal_code,
                                      country: address.country,
                                      phone: address.phone || "",
                                      isDefault: address.is_default
                                    });
                                  }}
                                  size="sm"
                                  variant="outline"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteAddress(address.id)}
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Order History Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No orders yet</p>
                      <p className="text-sm text-gray-400">Your order history will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">Order #{order.order_number}</h3>
                              <p className="text-sm text-gray-500">
                                Placed on {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{order.itemCount} item{order.itemCount > 1 ? 's' : ''}</span>
                            <span>Payment: {order.payment_status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Password Change */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Change Password</h3>
                      {!isEditingPassword && (
                        <Button onClick={() => setIsEditingPassword(true)} variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      )}
                    </div>
                    
                    {isEditingPassword ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Current Password</label>
                          <Input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">New Password</label>
                          <Input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                          <Input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            placeholder="Confirm new password"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handlePasswordSave} disabled={isLoading}>
                            <Save className="w-4 h-4 mr-2" />
                            Update Password
                          </Button>
                          <Button 
                            onClick={() => {
                              setIsEditingPassword(false);
                              setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                            }} 
                            variant="outline"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        Keep your account secure by using a strong password.
                      </p>
                    )}
                  </div>

                  {/* Account Security Info */}
                  <div>
                    <h3 className="font-medium mb-2">Account Security</h3>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>• Your account is protected with security questions for password recovery</p>
                      <p>• We recommend using a strong, unique password</p>
                      <p>• Log out from shared devices when finished</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
