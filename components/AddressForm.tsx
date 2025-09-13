'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

interface Address {
  _id?: string;
  userEmail: string;
  name: string;
  fullName: string;
  address: string;
  road: string;
  pinCode: string;
  country: string;
  state: string;
  city: string;
  phoneNumber: string;
  isDefault?: boolean;
}

interface AddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (address: Address) => void;
  userEmail: string;
  editingAddress?: Address | null;
}

const AddressForm: React.FC<AddressFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userEmail,
  editingAddress
}) => {
  const [formData, setFormData] = useState<Omit<Address, 'userEmail'>>({
    name: '',
    fullName: '',
    address: '',
    road: '',
    pinCode: '',
    country: 'India',
    state: '',
    city: '',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        name: editingAddress.name,
        fullName: editingAddress.fullName,
        address: editingAddress.address,
        road: editingAddress.road,
        pinCode: editingAddress.pinCode,
        country: editingAddress.country,
        state: editingAddress.state,
        city: editingAddress.city,
        phoneNumber: editingAddress.phoneNumber,
      });
    } else {
      setFormData({
        name: '',
        fullName: '',
        address: '',
        road: '',
        pinCode: '',
        country: 'India',
        state: '',
        city: '',
        phoneNumber: '',
      });
    }
  }, [editingAddress, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingAddress 
        ? `/api/addresses/${editingAddress._id}`
        : '/api/addresses';
      
      const method = editingAddress ? 'PUT' : 'POST';
      
      const requestBody = {
        ...formData,
        userEmail,
      };

      console.log('Sending address data:', requestBody);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save address');
      }

      toast.success(editingAddress ? 'Address updated successfully!' : 'Address created successfully!');
      onSuccess(responseData.address);
      onClose();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(`Failed to save address: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md border-2 border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="name">Address Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Home, Office"
              className="border-2 border-gray-200 focus:border-gray-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Recipient's full name"
              className="border-2 border-gray-200 focus:border-gray-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Full Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Complete address including street, building, etc."
              className="border-2 border-gray-200 focus:border-gray-400"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="road">Road/Street</Label>
            <Input
              id="road"
              value={formData.road}
              onChange={(e) => handleInputChange('road', e.target.value)}
              placeholder="Road or street name"
              className="border-2 border-gray-200 focus:border-gray-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pinCode">PIN Code</Label>
              <Input
                id="pinCode"
                value={formData.pinCode}
                onChange={(e) => handleInputChange('pinCode', e.target.value)}
                placeholder="123456"
                className="border-2 border-gray-200 focus:border-gray-400"
                maxLength={6}
                required
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="9876543210"
                className="border-2 border-gray-200 focus:border-gray-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="border-2 border-gray-200 focus:border-gray-400"
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="State or province"
                className="border-2 border-gray-200 focus:border-gray-400"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="City name"
              className="border-2 border-gray-200 focus:border-gray-400"
              required
            />
          </div>


          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-gray-200 hover:border-gray-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-black text-white hover:bg-gray-800"
            >
              {isLoading ? 'Saving...' : (editingAddress ? 'Update' : 'Save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
