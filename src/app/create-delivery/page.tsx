"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash } from "lucide-react";
import Header from "@/components/Header";
import toast, { Toaster } from "react-hot-toast";
import { Company, DeliveryInputs, DeliveryProducts } from "@/types/types";

const Page = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<DeliveryProducts[]>([]);

  const handleRowAddition = () => {
    setProducts((prevProducts) => [...prevProducts, { description: "" }]);
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DeliveryInputs>();

  const fetchCompany = async (CompanyName: string) => {
    try {
      const response = await fetch(`/api/company/findCompany/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CompanyName }),
      });

      const result = await response.json();

      if (!response.ok) {
        setCompany({});
        console.log("No company found, setting company to null.");
        return;
      }

      setCompany(result.company);
      console.log("Company Found: ", company);
      toast.success(result.message);
    } catch (error) {
      console.log("There was an Error While Fetching Company: ", error);
      toast.error("There was an Error While Fetching Company");
    }
  };

  const companyName = watch("CompanyName");

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (companyName) {
      timeoutId = setTimeout(() => {
        fetchCompany(companyName);
      }, 1000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [companyName]);

  const createCompany = async (data: DeliveryInputs) => {
    try {
      const response = await fetch("/api/company/createCompany", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CompanyName: data.CompanyName, // Ensure case matches with backend
          CompanyTel: data.CompanyTel,
          CompanyAddress: data.CompanyAddress,
          ClientNo: data.ClientNo,
          ClientEmail: data.ClientEmail,
          ClientName: data.ClientName,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        return result.company; // Return the created company object
      } else {
        throw new Error(result.message || "Error Creating Company");
      }
    } catch (error) {
      console.log("There was an Error While Creating Company: ", error);
      toast.error("There was an Error While Creating Company");
      return null;
    }
  };

  const onSubmit: SubmitHandler<DeliveryInputs> = async (data) => {
    let companyData = company;

    if (!companyData) {
      let companyData = await createCompany(data);
    }
    const delivery = {
      ...data,
      CompanyName: companyData?.CompanyName,
      CompanyTel: companyData?.CompanyTel,
      CompanyAddress: companyData?.CompanyAddress,
      ClientNo: companyData?.ClientNo,
      ClientEmail: companyData?.ClientEmail,
      ClientName: companyData?.ClientName,
      products,
    };

    try {
      const response = await fetch("/api/delivery/createDelivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(delivery),
      });

      if (!response.ok) {
        throw new Error("Failed to create Challan");
      }

      const result = await response.json();
      toast.success(result.message);
      reset();
      setProducts([]);
      setCompany(null);
    } catch (error: any) {
      console.log("There was an Error While Creating an Challan: ", error);
      toast.error(error.message);
    }
  };

  const handleInputChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      const product = { ...updatedProducts[index], [field]: value };
      updatedProducts[index] = product;
      return updatedProducts;
    });
  };

  const handleDeletion = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  return (
    <>
      <Header />
      <Toaster position="top-right" reverseOrder={false} />
      <section className="max-container">
        <form
          className="flex flex-col justify-between gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Card className="dark:bg-transparent dark:border-[#27272A]">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                Important Information about the Client and its Company
              </CardDescription>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col items-start justify-between">
                  <Label className="mb-2">Company Name</Label>
                  <Input
                    type="text"
                    placeholder="Enter Company Name"
                    {...register("CompanyName", { required: true })}
                  />
                  {errors.CompanyName && (
                    <p className="error">Company Name is required</p>
                  )}
                </div>
                {company ? (
                  <>
                    <div className="flex flex-col items-start justify-between">
                      <Label className="mb-2">Company Tel#</Label>
                      <Input
                        type="number"
                        placeholder="Enter Company Tel#"
                        disabled
                        value={company.CompanyTel}
                      />
                    </div>
                    <div className="flex flex-col items-start justify-between">
                      <Label className="mb-2">Company Address</Label>
                      <Input
                        type="text"
                        placeholder="Enter Company Address"
                        disabled
                        value={company.CompanyAddress}
                      />
                    </div>
                    <div className="flex flex-col items-start justify-between">
                      <Label className="mb-2">Client Mobile #</Label>
                      <Input
                        type="number"
                        placeholder="Enter Client Mobile Number"
                        disabled
                        value={company.ClientNo}
                      />
                    </div>
                    <div className="flex flex-col items-start justify-between">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter Client Email"
                        disabled
                        value={company.ClientEmail}
                      />
                    </div>
                    <div className="flex flex-col items-start justify-between">
                      <Label className="mb-2">Client Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter Client Name"
                        disabled
                        value={company.ClientName}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Company Details Inputs for Manual Entry */}
                    <div className="flex flex-col items-start justify-between">
                      <Label className="mb-2">Company Tel#</Label>
                      <Input
                        type="number"
                        placeholder="Enter Company Tel#"
                        {...register("CompanyTel", { required: true })}
                      />
                      {errors.CompanyTel && (
                        <p className="error">Company Tel# is required</p>
                      )}
                    </div>
                    <div className="flex flex-col items-start justify-between">
                      <Label className="mb-2">Company Address</Label>
                      <Input
                        type="text"
                        placeholder="Enter Company Address"
                        {...register("CompanyAddress", { required: true })}
                      />
                      {errors.CompanyAddress && (
                        <p className="error">Company Address is required</p>
                      )}
                    </div>
                    <div className="flex flex-col items-start justify-between">
                      <Label className="mb-2">Client Mobile #</Label>
                      <Input
                        type="number"
                        placeholder="Enter Client Mobile Number"
                        {...register("ClientNo")}
                      />
                    </div>
                    <div className="flex flex-col items-start justify-between">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter Client Email"
                        {...register("ClientEmail", {
                          pattern: {
                            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                            message: "Invalid email address",
                          },
                        })}
                      />
                    </div>
                    <div className="flex flex-col items-start justify-between">
                      <Label className="mb-2">Client Name</Label>
                      <Input
                        type="text"
                        placeholder="Enter Client Name"
                        {...register("ClientName")}
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-transparent dark:border-[#27272A]">
            <CardHeader>
              <CardTitle>delivery Information</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                Important Information about the delivery and Delivery
              </CardDescription>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col items-start justify-between">
                  <Label className="mb-2">DC Date</Label>
                  <Input
                    type="date"
                    {...register("DCDate", { required: true })}
                  />
                  {errors.DCDate && (
                    <p className="error">DC Date is required</p>
                  )}
                </div>
                <div className="flex flex-col items-start justify-between">
                  <Label className="mb-2">PO. No.</Label>
                  <Input
                    type="text"
                    {...register("PoNumber", { required: true })}
                  />
                  {errors.PoNumber && (
                    <p className="error">PO. No. is required</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-transparent dark:border-[#27272A]">
            <CardHeader className="px-7">
              <CardTitle>Products Information</CardTitle>
              <CardDescription>
                Products Purchased by the Client
              </CardDescription>
            </CardHeader>
            <CardContent className="mb-5">
              <div className="overflow-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="grid grid-cols-5 items-center pt-5">
                      <TableHead className="hidden md:table-cell">
                        Description
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product, index) => (
                      <TableRow
                        key={index}
                        className="bg-accent grid justify-between grid-cols-1 md:grid-cols-5 items-center"
                      >
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="Description"
                            value={product.description}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
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
            <CardFooter className="flex justify-between items-center flex-row">
              <div>
                <Button type="button" onClick={handleRowAddition}>
                  Add Item
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Button variant={"secondary"} type="submit">
            Create Delivery
          </Button>
        </form>
      </section>
    </>
  );
};

export default Page;
