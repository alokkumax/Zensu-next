'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import AddressForm from './AddressForm';
import toast from 'react-hot-toast';

interface Address {
  _id: string;
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
  isDefault: boolean;
}

interface AddressSelectionProps {
  userEmail: string;
  selectedAddress: Address | null;
  onAddressSelect: (address: Address | null) => void;
}

const AddressSelection: React.FC<AddressSelectionProps> = ({
  userEmail,
  selectedAddress,
  onAddressSelect
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/addresses?userEmail=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      
      if (response.ok) {
        setAddresses(data.addresses || []);
        // Auto-select default address or first address
        if (data.addresses && data.addresses.length > 0) {
          const defaultAddress = data.addresses.find((addr: Address) => addr.isDefault) || data.addresses[0];
          onAddressSelect(defaultAddress);
        }
      } else {
        console.error('Error fetching addresses:', data.error);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userEmail, onAddressSelect]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddressSelect = (addressId: string) => {
    const address = addresses.find(addr => addr._id === addressId);
    onAddressSelect(address || null);
  };

  const handleCreateAddress = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Address deleted successfully!');
        fetchAddresses();
        // If deleted address was selected, clear selection
        if (selectedAddress?._id === addressId) {
          onAddressSelect(null);
        }
      } else {
        throw new Error('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address. Please try again.');
    }
  };

  const handleFormSuccess = (address: any) => {
    // Close the form first
    setShowForm(false);
    setEditingAddress(null);
    
    // Immediately add the new address to the list and select it
    if (editingAddress) {
      // Update existing address in the list
      setAddresses(prev => 
        prev.map(addr => addr._id === address._id ? address : addr)
      );
    } else {
      // Add new address to the list
      setAddresses(prev => [address, ...prev]);
    }
    
    // Select the address
    onAddressSelect(address);
  };

  if (isLoading) {
    return (
      <div className="bg-white border-2 border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Delivery Address</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          Loading addresses...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border-2 border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Delivery Address</h3>
          </div>
          <Button
            onClick={handleCreateAddress}
            variant="outline"
            size="sm"
            className="border-2 border-gray-200 hover:border-gray-400"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No addresses found</p>
            <Button
              onClick={handleCreateAddress}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Address
            </Button>
          </div>
        ) : (
          <RadioGroup
            value={selectedAddress?._id || ''}
            onValueChange={handleAddressSelect}
            className="space-y-2"
          >
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`border-2 p-3 transition-all ${
                  selectedAddress?._id === address._id
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value={address._id}
                    id={`address-${address._id}`}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={`address-${address._id}`}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-sm">{address.name}</span>
                          <p className="text-xs text-gray-600 mt-1">{address.road}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(address);
                            }}
                            className="p-1 hover:bg-gray-200 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(address._id);
                            }}
                            className="p-1 hover:bg-gray-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      <AddressForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
        userEmail={userEmail}
        editingAddress={editingAddress}
      />
    </>
  );
};

export default AddressSelection;
