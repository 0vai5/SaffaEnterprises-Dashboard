'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

type Inputs = {
  ClientNo: number;
  ClientEmail: string;
  ClientName: string;
  OrganizationName: string;
  OrganizationTel: number;
  OrganizationAddress: string;
  InvoiceDate: string;
  PoNumber: number;
  DCNo: number;
  DCDate: string;
}

type Products = {
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const Page = () => {
  const router = useRouter()
  const [products, setProducts] = useState<Products[]>([]);

  const handleRowAddition = () => {
    setProducts([...products, { product: '', quantity: 1, unitPrice: 0, total: 0 }]);
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const grandTotal = calculateGrandTotal();
    const invoice = { ...data, products, grandTotal };
  
    try {
      const response = await fetch('/api/invoice/createInvoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice)
      });
  
      if (!response.ok) {
        throw new Error('Failed to create Invoice');
      }
      reset();
      setProducts([])
    } catch (error) {
      console.log('There was an Error While Creating an Invoice: ', error);
    }
  };
  

  const handleInputChange = (index: number, field: string, value: string | number) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      const product = { ...updatedProducts[index], [field]: value };

      // Recalculate total
      product.total = product.quantity * product.unitPrice;
      updatedProducts[index] = product;
      return updatedProducts;
    });
  }

  const calculateGrandTotal = () => {
    return products.reduce((total, product) => total + product.total, 0);
  }

  const handleDeletion = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  }

  return (
    <>
    <Header />
    <section className='max-container'>
      <form className='flex flex-col justify-between gap-4' onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className='mb-3'>
              Important Information about the Client and its Organization
            </CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className='flex flex-col items-start justify-between'>
                <Label className='mb-2'>Client Mobile #</Label>
                <Input
                  type='number'
                  placeholder='Enter Client Mobile Number'
                  {...register('ClientNo', { required: true })}
                />
                {errors.ClientNo && <p className="error">Client Mobile # is required</p>}
              </div>
              <div className='flex flex-col items-start justify-between'>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  placeholder='Enter Client Email'
                  {...register('ClientEmail', {
                    required: "Email is required",
                    pattern: {
                      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                      message: "Invalid email address"
                    }
                  })} />
                {errors.ClientEmail && <p className="error">{errors.ClientEmail.message}</p>}
              </div>
              <div className='flex flex-col items-start justify-between'>
                <Label className='mb-2'>Client Name</Label>
                <Input
                  type='text'
                  placeholder='Enter Client Name'
                  {...register('ClientName', { required: true })}
                />
                {errors.ClientName && <p className="error">Client Name is required</p>}
              </div>
              <div className='flex flex-col items-start justify-between'>
                <Label className='mb-2'>Organization Name</Label>
                <Input
                  type='text'
                  placeholder='Enter Organization Name'
                  {...register('OrganizationName', { required: true })}
                />
                {errors.OrganizationName && <p className="error">Organization Name is required</p>}
              </div>
              <div className='flex flex-col items-start justify-between'>
                <Label className='mb-2'>Organization Tel#</Label>
                <Input
                  type='text'
                  placeholder='Enter Organization Tel#'
                  {...register('OrganizationTel', { required: true })}
                />
                {errors.OrganizationTel && <p className="error">Organization Tel# is required</p>}
              </div>
              <div className='flex flex-col items-start justify-between'>
                <Label className='mb-2'>Organization Address</Label>
                <Input
                  type='text'
                  placeholder='Enter Organization Address'
                  {...register('OrganizationAddress', { required: true })}
                />
                {errors.OrganizationAddress && <p className="error">Organization Address is required</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Information</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className='mb-3'>
              Important Information about the Invoice and Delivery
            </CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className='flex flex-col items-start justify-between'>
                <Label className='mb-2'>DC No. #</Label>
                <Input
                  type='number'
                  placeholder='Enter Delivery Number'
                  {...register('DCNo', { required: true })}
                />
                {errors.DCNo && <p className="error">DC No. # is required</p>}
              </div>
              <div className='flex flex-col items-start justify-between'>
                <Label className='mb-2'>DC Date</Label>
                <Input type='date'
                  {...register('DCDate', { required: true })}
                />
                {errors.DCDate && <p className="error">DC Date is required</p>}
              </div>
              <div className='flex flex-col items-start justify-between'>
                <Label className='mb-2'>Invoice Date</Label>
                <Input type='date'
                  {...register('InvoiceDate', { required: true })}
                />
                {errors.InvoiceDate && <p className="error">Invoice Date is required</p>}
              </div>
              <div className='flex flex-col items-start justify-between'>
                <Label className='mb-2'>PO. No.</Label>
                <Input type='number'
                  {...register('PoNumber', { required: true })}
                />
                {errors.PoNumber && <p className="error">PO. No. is required</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-7">
            <CardTitle>Products Information</CardTitle>
            <CardDescription>Products Purchased by the Client</CardDescription>
          </CardHeader>
          <CardContent className='mb-5'>
            <Card x-chunk="dashboard-05-chunk-3">
              <CardContent>
                <div className="overflow-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow className='grid grid-cols-5 items-center pt-5'>
                        <TableHead className='hidden md:table-cell'>Product</TableHead>
                        <TableHead className="hidden md:table-cell">Quantity</TableHead>
                        <TableHead className="hidden md:table-cell">Unit Price</TableHead>
                        <TableHead className="hidden md:table-cell">Amount</TableHead>
                        <TableHead className="hidden md:table-cell">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product, index) => (
                        <TableRow key={index} className="bg-accent grid justify-between grid-cols-1 md:grid-cols-5 items-center">
                          <TableCell>
                            <Input
                              type="text"
                              placeholder='Product'
                              value={product.product}
                              onChange={(e) => handleInputChange(index, 'product', e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="table-cell">
                            <Input
                              type="number"
                              placeholder='Quantity'
                              value={product.quantity}
                              onChange={(e) => handleInputChange(index, 'quantity', Number(e.target.value))}
                            />
                          </TableCell>
                          <TableCell className="table-cell">
                            <Input
                              type="number"
                              placeholder='Unit Price'
                              value={product.unitPrice}
                              onChange={(e) => handleInputChange(index, 'unitPrice', Number(e.target.value))}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            Rs. {product.total ? product.total.toFixed(2) : '0.00'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-7 gap-1 text-sm"
                              onClick={() => handleDeletion(index)}
                            >
                              <Trash className="h-3.5 w-3.5" />
                              <span className="not-sr-only">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </CardContent>
          <CardFooter className='flex justify-between items-center wflex-row'>
            <div>
              <Button onClick={handleRowAddition}>Add Item</Button>
            </div>
            <div>
              Grand Total: Rs. {calculateGrandTotal().toFixed(2)}
            </div>
          </CardFooter>
        </Card>

        <Button variant={'secondary'} type="submit">Create Invoice</Button>
      </form>
    </section>
    </>
  )
}

export default Page;
