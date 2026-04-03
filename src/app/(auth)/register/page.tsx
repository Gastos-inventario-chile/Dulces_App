"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Mail, Lock, User, Candy } from "lucide-react";
import { registerUser } from "@/services/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm<FormData>();
  const pwd = watch("password");

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await registerUser(data.email, data.password, data.name);
      router.push("/");
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado");
      } else {
        setError("Ocurrió un error. Intenta de nuevo.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-primary-200">
            <Candy size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
          <p className="text-sm text-gray-500 mt-1">Empieza a gestionar tus ventas</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Tu nombre"
              type="text"
              placeholder="María García"
              icon={<User size={16} />}
              error={errors.name?.message}
              {...register("name", { required: "El nombre es requerido" })}
            />
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@correo.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register("email", {
                required: "El correo es requerido",
                pattern: { value: /^\S+@\S+$/, message: "Correo inválido" },
              })}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />
            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              error={errors.confirm?.message}
              {...register("confirm", {
                required: "Confirma tu contraseña",
                validate: (v) => v === pwd || "Las contraseñas no coinciden",
              })}
            />

            {error && (
              <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              Crear cuenta
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary-600 font-semibold hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
