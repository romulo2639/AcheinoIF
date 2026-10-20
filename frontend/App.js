import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
} from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "./src/config/firebase";
import LoginScreen from "./src/screens/LoginScreen";
import CadastroScreen from "./src/screens/CadastroScreen";
import EsqueciSenhaScreen from "./src/screens/EsqueciSenhaScreen";
import HomeScreen from "./src/screens/HomeScreen";
import HomeFuncionarioScreen from "./src/screens/HomeFuncionarioScreen";
import CriarObjetoScreen from "./src/screens/CriarObjetoScreen";

export default function App() {
  const [user, setUser] = useState(undefined);
  const [tela, setTela] = useState("login");
  const [funcionarioTeste, setFuncionarioTeste] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario);
    });

    return unsubscribe;
  }, []);

  async function fazerLogout() {
    if (funcionarioTeste) {
      setFuncionarioTeste(false);
      setTela("login");
      return;
    }

    try {
      await signOut(auth);
      setTela("login");
    } catch (erro) {
      console.error("Erro ao sair:", erro);
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  }

  // Aguarda o Firebase verificar a sessão do usuário.
  if (user === undefined && !funcionarioTeste) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" color="#1454C7" />
      </View>
    );
  }

  // Área administrativa do funcionário.
  if (funcionarioTeste) {
    // Tela de cadastro de objetos.
    if (tela === "criarObjeto") {
      return (
        <CriarObjetoScreen
          onVoltar={() => setTela("homeFuncionario")}
        />
      );
    }

    // Painel principal do funcionário.
    return (
      <HomeFuncionarioScreen
        onSair={fazerLogout}
        onBuscarOcorrencias={() =>
          Alert.alert(
            "Buscar ocorrências",
            "A funcionalidade será implementada."
          )
        }
        onCadastrarObjeto={() => setTela("criarObjeto")}
        onGerenciarOcorrencias={() =>
          Alert.alert(
            "Gerenciar ocorrências",
            "A funcionalidade será implementada."
          )
        }
        onVerRelatorios={() =>
          Alert.alert(
            "Relatórios",
            "A funcionalidade será implementada."
          )
        }
        onConfiguracoes={() =>
          Alert.alert(
            "Configurações",
            "A funcionalidade será implementada."
          )
        }
      />
    );
  }

  // Área do usuário autenticado pelo Firebase.
  if (user) {
    if (tela === "criarObjeto") {
      return (
        <CriarObjetoScreen
          user={user}
          onVoltar={() => setTela("home")}
        />
      );
    }

    return (
      <HomeScreen
        user={user}
        onCriarObjeto={() => setTela("criarObjeto")}
      />
    );
  }

  // Cadastro.
  if (tela === "cadastro") {
    return (
      <CadastroScreen
        onVoltar={() => setTela("login")}
        onCadastroSucesso={() => setTela("login")}
      />
    );
  }

  // Recuperação de senha.
  if (tela === "esqueciSenha") {
    return (
      <EsqueciSenhaScreen
        onVoltar={() => setTela("login")}
      />
    );
  }

  // Login.
  return (
    <LoginScreen
      onLoginSuccess={(usuario, tipo) => {
        if (tipo === "funcionario") {
          setFuncionarioTeste(true);
          setTela("homeFuncionario");
        } else {
          setFuncionarioTeste(false);
          setTela("home");
        }
      }}
      onCadastrar={() => setTela("cadastro")}
      onEsqueciSenha={() => setTela("esqueciSenha")}
    />
  );
}

const styles = StyleSheet.create({
  carregando: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});