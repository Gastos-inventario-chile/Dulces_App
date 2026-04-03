"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Mail, Lock, Candy } from "lucide-react";
import { loginUser } from "@/services/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await loginUser(data.email, data.password);
      router.push("/");
    } catch (e: any) {
      if (e.code === "auth/invalid-credential" || e.code === "auth/user-not-found") {
        setError("Email o contraseña incorrectos");
      } else {
        setError("Ocurrió un error. Intenta de nuevo.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-primary-200">
            <Candy size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">DulcesApp</h1>
          <p className="text-sm text-gray-500 mt-1">Inicia sesión en tu cuenta</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            {error && (
              <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isSubmitting}
            >
              Iniciar sesión
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-primary-600 font-semibold hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
