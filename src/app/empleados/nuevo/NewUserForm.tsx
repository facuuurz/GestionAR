"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, ShieldCheck, User } from "lucide-react";
import { registerUser } from "@/actions/auth"; // We'll modify or create an action for this
import { toast } from "react-hot-toast";

export default function NewUserForm({ currentUserRole }: { currentUserRole: string }) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "EMPLEADO", // Default
    dni: "",
    cuit: "",
    profilePicture: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe superar los 5MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona una imagen válida.");
      return;
    }

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, profilePicture: reader.result as string });
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const newErrors: Record<string, string> = {};

    // Custom validations replacing HTML "required"
    if (!formData.username.trim()) newErrors.username = "Por favor, ingresa el Nombre de Usuario";
    if (!formData.email.trim()) newErrors.email = "Por favor, ingresa el Correo Electrónico";
    if (!formData.password) newErrors.password = "Por favor, ingresa una Contraseña";
    if (!formData.name.trim()) newErrors.name = "Por favor, ingresa el Nombre Completo";

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    } else if (formData.password && !/[A-Z]/.test(formData.password)) {
      newErrors.password = "La contraseña debe incluir al menos una letra mayúscula.";
    } else if (formData.password && !/[0-9]/.test(formData.password)) {
      newErrors.password = "La contraseña debe incluir al menos un número (0-9).";
    } else if (formData.password && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(formData.password)) {
      newErrors.password = "La contraseña debe incluir al menos un símbolo especial.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await registerUser(
        formData.username,
        formData.password,
        formData.email,
        formData.name,
        formData.role,
        formData.dni,
        formData.cuit,
        formData.profilePicture
      );

      if (!res.success) {
        toast.error(res.error || "Ocurrió un error al registrar el usuario", {
          style: { background: "#EF4444", color: "#fff" } // Red
        });
        setError(res.error || "Ocurrió un error al registrar el usuario");
        return;
      }

      toast.success("Usuario creado con éxito", {
        style: { background: "#10B981", color: "#fff", padding: "16px" }, // Green
        iconTheme: { primary: "#fff", secondary: "#10B981" }
      });
      router.push("/empleados");
      
    } catch (err) {
      setError("Error interno del servidor. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
      <div className="layout-content-container flex flex-col w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col gap-6 pb-6 border-b border-[#ededed] dark:border-[#333] mb-8">
          <Link href="/empleados" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 w-fit transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver a la lista
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
              <UserPlus className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-primary dark:text-white text-2xl sm:text-3xl font-bold leading-tight">
                Crear Nuevo Usuario
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-base">
                Completa los datos para dar acceso a un nuevo integrante.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] rounded-2xl p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-xl text-sm font-medium flex items-center gap-2">
               <span className="material-symbols-outlined shrink-0 text-xl">error</span>
               {error}
            </div>
          )}

          <div className="flex items-center gap-6 mb-8 p-4 sm:p-6 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 transition-all">
            <div className="shrink-0 relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white dark:bg-[#222] border-4 border-indigo-100 dark:border-indigo-900/50 shadow-md flex items-center justify-center overflow-hidden">
              {formData.profilePicture ? (
                <img src={formData.profilePicture} alt="Vista previa" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center">
                  <User className="w-12 h-12 text-indigo-400 dark:text-indigo-500" />
                </div>
              )}

              {isUploadingImage && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Foto de perfil <span className="text-sm font-normal text-gray-500">(Opcional)</span>
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2 max-w-xs">
                Sube una imagen para identificar a este usuario. Formato PNG, JPG. Máximo 5MB.
              </p>
              
              <label className="group flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 w-fit bg-black text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 dark:bg-white dark:text-black">
                <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">add_a_photo</span>
                <span className="text-sm font-bold truncate">
                  {formData.profilePicture ? "Cambiar foto" : "Cargar imagen"}
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                  disabled={isUploadingImage}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-[#ededed] dark:border-[#333] pb-2">Datos de Acceso</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de Usuario *</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className={`w-full px-3 py-2.5 border rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-[#ededed] dark:border-[#444] focus:ring-indigo-500'}`}
                  placeholder="ej: jdoe"
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico *</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-3 py-2.5 border rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-[#ededed] dark:border-[#444] focus:ring-indigo-500'}`}
                  placeholder="juan@ejemplo.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña Inicial *</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`w-full px-3 py-2.5 border rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-[#ededed] dark:border-[#444] focus:ring-indigo-500'}`}
                  placeholder="••••••••"
                />
                {errors.password ? (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 ml-1">
                    Mín. 8 caracteres, una mayúscula, un número y un símbolo.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Contraseña *</label>
                <input 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`w-full px-3 py-2.5 border rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-[#ededed] dark:border-[#444] focus:ring-indigo-500'}`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-[#ededed] dark:border-[#333] pb-2">Información Personal</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-3 py-2.5 border rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-[#ededed] dark:border-[#444] focus:ring-indigo-500'}`}
                  placeholder="Juan Pérez"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">DNI</label>
                  <input 
                    type="text" 
                    value={formData.dni}
                    onChange={(e) => setFormData({...formData, dni: e.target.value})}
                    className="w-full px-3 py-2.5 border border-[#ededed] dark:border-[#444] rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Sin puntos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CUIT / CUIL</label>
                  <input 
                    type="text" 
                    value={formData.cuit}
                    onChange={(e) => setFormData({...formData, cuit: e.target.value})}
                    className="w-full px-3 py-2.5 border border-[#ededed] dark:border-[#444] rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="20-12345678-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nivel de Acceso *</label>
                
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <label className={`
                    relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all
                    ${formData.role === 'EMPLEADO' 
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' 
                      : 'border-[#ededed] dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#333]'}
                  `}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="EMPLEADO" 
                      className="peer sr-only"
                      onChange={() => setFormData({...formData, role: "EMPLEADO"})}
                      checked={formData.role === "EMPLEADO"}
                    />
                    <User className={`w-6 h-6 mb-2 ${formData.role === 'EMPLEADO' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
                    <span className={`text-sm font-bold ${formData.role === 'EMPLEADO' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                      Empleado
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Acceso limitado al punto de venta.</span>
                  </label>

                  {/* Solamente los administradores pueden crear a otros administradores o los superadmin */}
                  {(currentUserRole === "ADMIN" || currentUserRole === "SUPERADMIN") && (
                    <label className={`
                      relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all
                      ${formData.role === 'ADMIN' 
                        ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-900/20' 
                        : 'border-[#ededed] dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#333]'}
                    `}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="ADMIN" 
                        className="peer sr-only"
                        onChange={() => setFormData({...formData, role: "ADMIN"})}
                        checked={formData.role === "ADMIN"}
                      />
                      <ShieldCheck className={`w-6 h-6 mb-2 ${formData.role === 'ADMIN' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                      <span className={`text-sm font-bold ${formData.role === 'ADMIN' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                        Administrador
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Gestión de inventario y personal.</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#ededed] dark:border-[#333]">
            <button 
              type="submit" 
              disabled={loading}
              className="group inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md hover:shadow-black/20 text-white bg-black dark:bg-white dark:text-black shrink-0 disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 flex items-center justify-center mr-1">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
                  </div>
                  Creando usuario...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  <span>Crear Usuario</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
