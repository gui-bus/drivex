import { useEffect } from "react";
import logoImg from "../../assets/drivexLogo.png";

import { Link, useNavigate } from "react-router-dom";
import { Container } from "../../components/container";
import { Input } from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaUserPlus } from "react-icons/fa";

import { auth } from "../../services/firebaseConnection";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório."),
  email: z
    .string()
    .email("Por favor, insira um e-mail válido.")
    .nonempty("O campo de e-mail é obrigatório."),
  password: z
    .string()
    .min(6, "A senha deve conter pelo menos 6 caracteres.")
    .nonempty("O campo de senha é obrigatório."),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }

    handleLogout();
  }, []);

  async function onSubmit(data: FormData) {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: data.name,
        });

        console.log("CADASTRADO COM SUCESSO!");
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        console.log("ERRO AO CADASTRAR ESTE USUARIO");
        console.log(error);
      });
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/" className="mb-6 max-w-sm w-full">
          <img
            src={logoImg}
            alt="Logo DriveX"
            className="w-48 h-auto mx-auto"
          />
        </Link>

        <form
          className="bg-white max-w-xl w-full rounded-lg p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <Input
              type="text"
              placeholder="Digite seu nome completo"
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="email"
              placeholder="Digite seu email"
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3 text-center">
            <Input
              type="password"
              placeholder="Digite sua senha"
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button
            type="submit"
            className="bg-teal-400 hover:bg-teal-500 w-full rounded-md text-white h-10 font-medium flex items-center justify-center gap-2"
          >
            Registrar <FaUserPlus size={24} color="#FFF" />
          </button>
        </form>

        <Link
          to="/login"
          className="hover:underline transition-all duration-200 ease-linear text-center"
        >
          Já possui uma conta? Faça o login!
        </Link>
      </div>
    </Container>
  );
}
