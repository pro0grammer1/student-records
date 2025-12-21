"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import Image from "next/image";
import { check } from "zod";

interface StudentForm {
  roll_no: string;
  name: string;
  classvar: string;
  ph_no: string;
  image: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { signedIn, checkSession } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [form, setForm] = useState<StudentForm>({
    roll_no: "",
    name: "",
    classvar: "",
    ph_no: "",
    image: "",
  });

  // Check authentication
  useEffect(() => {
    const myPromise = new Promise((resolve) => {
      checkSession();
      if (signedIn === true) resolve(true);
      else resolve(false);
    });
    myPromise.then((checkAuth) => {
      if (checkAuth === false) {
        router.push("/login");
        return;
      } else {
        setLoading(false);
      }
    });
  }, [signedIn, router]);

  // Convert image file to base64 string
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size should be less than 5MB" });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please upload a valid image file" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setForm((prev) => ({ ...prev, image: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const validateForm = (): string | null => {
    if (!form.roll_no.trim()) return "Roll number is required";
    if (isNaN(Number(form.roll_no)))
      return "Roll number must be a valid number";
    if (!form.name.trim()) return "Name is required";
    if (!form.classvar.trim()) return "Class is required";
    if (form.ph_no && isNaN(Number(form.ph_no)))
      return "Phone number must be a valid number";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/student-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roll_no: parseInt(form.roll_no),
          name: form.name.trim(),
          classvar: form.classvar.trim(),
          ph_no: form.ph_no ? parseInt(form.ph_no) : undefined,
          image: form.image || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setForm({
          roll_no: "",
          name: "",
          classvar: "",
          ph_no: "",
          image: "",
        });
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to submit form. Please try again.",
      });
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      roll_no: "",
      name: "",
      classvar: "",
      ph_no: "",
      image: "",
    });
    setMessage({ type: "", text: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!signedIn) {
    return null;
  }

  return (
    <div className="text-white max-w-2xl m-auto p-6">
      <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-6">Add New Student</h2>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === "success"
                ? "bg-green-900 text-green-200 border border-green-700"
                : "bg-red-900 text-red-200 border border-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Roll Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="roll_no"
              value={form.roll_no}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter roll number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Student Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter student name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Class <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="classvar"
              value={form.classvar}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter class (e.g., 10A, 12B)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="ph_no"
              value={form.ph_no}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter phone number (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
            />
            <p className="text-sm text-gray-400 mt-1">
              Max size: 5MB. Supported formats: JPG, PNG, GIF
            </p>

            {form.image && (
              <div className="mt-3">
                <p className="text-sm text-gray-300 mb-2">Preview:</p>
                <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-600">
                  <Image
                    src={form.image}
                    alt="Preview"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white p-3 rounded font-medium transition-colors"
            >
              {submitting ? "Adding Student..." : "Add Student"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="px-6 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
