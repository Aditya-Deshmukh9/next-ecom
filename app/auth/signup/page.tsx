"use client";
import AuthFormContainer from "@_components/AuthFormContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { CircleX } from "lucide-react";
import FormikFormErrors from "@/app/utils/Formikhelpers";
import { toast } from "react-toastify";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot be greater than 20 characters")
    .required("Password is required"),
});

function Signpage() {
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema,
    onSubmit: async (values, action) => {
      action.setSubmitting(true);
      await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(values),
      }).then(async (res) => {
        if (res.ok) {
          const { message } = (await res.json()) as { message: string };
          toast.success(message);
          console.log(message);
        }
        action.setSubmitting(false);
      });
    },
  });

  const formErrors: string[] = FormikFormErrors(errors, touched, values);

  const { name, email, password } = values;

  return (
    <AuthFormContainer title="Create New Account" onSubmit={handleSubmit}>
      <Input
        type="name"
        placeholder="Name"
        id="name"
        name="name"
        onChange={handleChange}
        onBlur={handleBlur}
        value={name}
      />
      <Input
        type="email"
        placeholder="Email"
        id="email"
        name="email"
        onChange={handleChange}
        onBlur={handleBlur}
        value={email}
      />
      <Input
        type="password"
        placeholder="Password"
        id="password"
        name="password"
        onChange={handleChange}
        onBlur={handleBlur}
        value={password}
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white"
      >
        Sign up
      </Button>
      <div className="">
        {formErrors.map((err) => {
          return (
            <div
              key={err}
              className="space-x-1 flex flex-row items-center text-red-500"
            >
              <CircleX size={14} />
              <p className="text-xs">{err}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}

export default Signpage;
