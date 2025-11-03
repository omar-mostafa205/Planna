"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FileUser, Target, Sparkles } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUploaderField } from "./FileUploaderField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner"; 
import { useRouter } from "next/navigation"; 

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters long" }),
  age: z.string().refine((val) => /^\d+$/.test(val) && parseInt(val) > 0 && parseInt(val) < 150, { 
    message: "Age must be a valid number between 1 and 149" 
  }),
  height: z.string().refine((val) => /^\d+$/.test(val) && parseInt(val) > 0 && parseInt(val) < 300, { 
    message: "Height must be a valid number in cm" 
  }),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender is required" }),
  activityLevel: z.enum(["Sedentary", "Lightly active", "Active", "Very active"], {
    required_error: "Activity level is required",
  }),
  goals: z.string().min(5, { message: "Please enter the client's goals." }),
  medicalConditions: z.string().optional(),
  images: z.array(z.instanceof(File)).min(1, {
    message: 'Design image is required',
  }),
});

export function ProfileForm() {
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      age: "",
      height: "",
      goals: "",
      medicalConditions: "",
      images: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'images') {
          values.images.forEach(file => {
            formData.append('images', file);
          });
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
  
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(await response.text());
      }
  
      const data = await response.json();
      toast.success("Diet plan generated successfully!");
      router.push('/dashboard');
    } catch (error) {
      console.error("Error generating plan:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate diet plan");
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="border border-gray-200 p-6 rounded-2xl bg-white shadow-sm">
          <h1 className="font-bold text-2xl flex items-center gap-2 mb-4">
            <FileUser className="w-6 h-6 text-blue-500" />
            InBody Analysis Upload
          </h1>
          <FileUploaderField form={form} />
        </div>

        <div className="border border-gray-200 p-6 rounded-2xl bg-white shadow-sm">
          <h1 className="font-bold text-2xl flex items-center gap-2 mb-6">
            <FileUser className="w-6 h-6 text-blue-500" />
            Client Information
          </h1>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client's full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter height in cm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sedentary">Sedentary</SelectItem>
                      <SelectItem value="Lightly active">Lightly active</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Very active">Very active</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="border border-gray-200 p-6 rounded-2xl bg-white shadow-sm">
          <h1 className="font-bold text-2xl flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-blue-500" />
            Goals & Health Information
          </h1>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Health & Fitness Goals</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Describe the client's goals (e.g., lose weight, build muscle, etc.)"
                      className="w-full min-h-[100px] border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medicalConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical Conditions & Allergies (Optional)</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="List any medical conditions, allergies, or dietary restrictions"
                      className="w-full min-h-[100px] border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        
        <div className="flex bg-gradient-to-r from-blue-500 to-teal-400 p-10 items-center justify-center mb-20 rounded-2xl flex-col">
          <h1 className="text-xl font-bold text-white mb-4">
            Ready to Generate Your AI Diet Plan?
          </h1>
          <p className="text-white mb-6">
            Our AI will analyze the InBody results and create a personalized nutrition plan
          </p>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto font-bold text-md bg-white text-blue-500 hover:bg-gray-200 transition-colors"
          >
            {isSubmitting ? "Generating..." : "Generate Diet Plan"} 
            <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </Form>
  );
}