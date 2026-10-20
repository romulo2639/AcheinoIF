
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../config/firebase";

function mensagemDeErro(codigo) {
  switch (codigo) {
    case "auth/invalid-email":
      return "Digite um e-mail válido.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "E-mail ou senha inválidos.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente mais tarde.";
    case "auth/network-request-failed":
      return "Sem conexão com a internet.";
    case "auth/user-disabled":
      return "Esta conta está desativada.";
    default:
      return "Erro ao fazer login.";
  }
}

export default function LoginScreen({
  onLoginSuccess,
  onCadastrar,
  onEsqueciSenha,
}) {
  const [tipoLogin, setTipoLogin] = useState("usuario");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin() {
    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo || !senha) {
      Alert.alert("Atenção", "Preencha o e-mail e a senha.");
      return;
    }

    setCarregando(true);

    // Login do funcionário com credenciais fixas
    if (tipoLogin === "funcionario") {
      if (
        emailLimpo === "funcionario@jaboatao" &&
        senha === "12345678"
      ) {
        onLoginSuccess?.(
          { email: "funcionario@jaboatao" },
          "funcionario"
        );
      } else {
        Alert.alert(
          "Acesso negado",
          "E-mail ou senha de funcionário incorretos."
        );
      }

      setCarregando(false);
      return;
    } else {
      // Login dos usuários comuns pelo Firebase
      try {
        const credencial = await signInWithEmailAndPassword(
          auth,
          emailLimpo,
          senha
        );

        onLoginSuccess?.(credencial.user, "usuario");
      } catch (error) {
        console.error("Erro Firebase:", error);
        Alert.alert("Erro", mensagemDeErro(error?.code));
      } finally {
        setCarregando(false);
      }
    }
  }

  const funcionario = tipoLogin === "funcionario";

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Elementos decorativos */}
          <View style={styles.circuloSuperior} />
          <View style={styles.circuloLateral} />

          <View style={styles.card}>
            {/* Identidade visual */}
            <View style={styles.logo}>
              <View style={styles.logoIcone}>
                <Text style={styles.logoEmoji}>⌕</Text>
                <View style={styles.logoPonto} />
              </View>

              <Text style={styles.titulo}>
                Achou<Text style={styles.tituloVerde}>NoIF</Text>
              </Text>

              <Text style={styles.subtitulo}>
                Achados e Perdidos
              </Text>
            </View>

            {/* Seleção do tipo de acesso */}
            <View style={styles.opcoes}>
              <TouchableOpacity
                style={[
                  styles.opcao,
                  !funcionario && styles.opcaoUsuarioAtiva,
                ]}
                onPress={() => setTipoLogin("usuario")}
                disabled={carregando}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.iconeOpcao,
                    !funcionario && styles.textoOpcaoAtivo,
                  ]}
                >
                  ♙
                </Text>

                <Text
                  style={[
                    styles.textoOpcao,
                    !funcionario && styles.textoOpcaoAtivo,
                  ]}
                >
                  Usuário
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.opcao,
                  funcionario && styles.opcaoFuncionarioAtiva,
                ]}
                onPress={() => setTipoLogin("funcionario")}
                disabled={carregando}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.iconeOpcao,
                    funcionario && styles.textoFuncionarioAtivo,
                  ]}
                >
                  ⛨
                </Text>

                <Text
                  style={[
                    styles.textoOpcao,
                    funcionario && styles.textoFuncionarioAtivo,
                  ]}
                >
                  Funcionário
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.descricao}>
              {funcionario
                ? "Acesso à área dos funcionários"
                : "Entre para encontrar ou cadastrar objetos"}
            </Text>

            {/* Campo de e-mail */}
            <Text style={styles.label}>E-mail</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputIcone}>✉</Text>

              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#9299A8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                editable={!carregando}
                returnKeyType="next"
              />
            </View>

            {/* Campo de senha */}
            <Text style={styles.label}>Senha</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputIcone}>♙</Text>

              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#9299A8"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                value={senha}
                onChangeText={setSenha}
                editable={!carregando}
                onSubmitEditing={fazerLogin}
                returnKeyType="go"
              />
            </View>

            {/* Botão de entrar */}
            <TouchableOpacity
              style={[
                styles.botaoEntrar,
                funcionario && styles.botaoEntrarFuncionario,
                carregando && styles.botaoDesabilitado,
              ]}
              onPress={fazerLogin}
              disabled={carregando}
              activeOpacity={0.85}
            >
              {carregando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textoBotaoEntrar}>
                  Entrar como {funcionario ? "funcionário" : "usuário"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Cadastro disponível para usuário */}
            {!funcionario && (
              <TouchableOpacity
                style={styles.botaoCadastro}
                onPress={onCadastrar}
                disabled={carregando}
                activeOpacity={0.85}
              >
                <Text style={styles.textoCadastro}>
                  Criar conta
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.botaoEsqueciSenha}
              onPress={onEsqueciSenha}
              disabled={carregando}
              activeOpacity={0.8}
            >
              <Text style={styles.textoEsqueciSenha}>
                Esqueci minha senha
              </Text>
            </TouchableOpacity>
          </View>

          {/* Rodapé */}
          <View style={styles.rodape}>
            <Text style={styles.rodapeSigla}>IFPE</Text>
            <Text style={styles.rodapeTexto}>
              Instituto Federal de Pernambuco
            </Text>
            <Text style={styles.rodapeCampus}>
              Campus Jaboatão
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    backgroundColor: "#07369B",
  },

  scroll: {
    flexGrow: 1,
  },

  container: {
    flexGrow: 1,
    minHeight: 750,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#07369B",
    paddingHorizontal: 20,
    paddingVertical: 35,
    overflow: "hidden",
  },

  circuloSuperior: {
    position: "absolute",
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: "#1454C7",
    opacity: 0.4,
    top: -150,
    left: -90,
  },

  circuloLateral: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: "#2164D7",
    opacity: 0.6,
    bottom: 100,
    right: -110,
  },

  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 25,
    paddingVertical: 30,
    borderRadius: 26,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },

  logo: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoIcone: {
    width: 66,
    height: 66,
    borderWidth: 6,
    borderColor: "#1454C7",
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    position: "relative",
  },

  logoEmoji: {
    fontSize: 34,
    lineHeight: 38,
    color: "#1454C7",
    fontWeight: "bold",
  },

  logoPonto: {
    position: "absolute",
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "#16A56A",
    right: -3,
    bottom: 0,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  titulo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1646A0",
    letterSpacing: -1,
  },

  tituloVerde: {
    color: "#16A56A",
  },

  subtitulo: {
    fontSize: 15,
    color: "#737B8B",
    marginTop: 4,
  },

  opcoes: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: "#DDE2EB",
    borderRadius: 13,
    padding: 3,
    marginBottom: 14,
  },

  opcao: {
    flex: 1,
    minHeight: 54,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 4,
  },

  opcaoUsuarioAtiva: {
    backgroundColor: "#1454C7",
  },

  opcaoFuncionarioAtiva: {
    backgroundColor: "#15803D",
  },

  iconeOpcao: {
    fontSize: 23,
    color: "#596273",
  },

  textoOpcao: {
    fontSize: 14,
    fontWeight: "700",
    color: "#596273",
  },

  textoOpcaoAtivo: {
    color: "#FFFFFF",
  },

  textoFuncionarioAtivo: {
    color: "#FFFFFF",
  },

  descricao: {
    color: "#737B8B",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 22,
  },

  label: {
    color: "#192743",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 5,
  },

  inputContainer: {
    height: 53,
    borderWidth: 1.5,
    borderColor: "#DDE2EB",
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginBottom: 13,
    backgroundColor: "#FFFFFF",
  },

  inputIcone: {
    width: 27,
    fontSize: 21,
    color: "#596273",
  },

  input: {
    flex: 1,
    height: "100%",
    color: "#202B40",
    fontSize: 15,
    paddingHorizontal: 7,
    outlineStyle: "none",
  },

  botaoEntrar: {
    minHeight: 53,
    marginTop: 9,
    borderRadius: 11,
    backgroundColor: "#1454C7",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },

  botaoEntrarFuncionario: {
    backgroundColor: "#15803D",
  },

  botaoDesabilitado: {
    opacity: 0.65,
  },

  textoBotaoEntrar: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  botaoCadastro: {
    minHeight: 50,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: "#1454C7",
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  textoCadastro: {
    color: "#1454C7",
    fontSize: 15,
    fontWeight: "700",
  },

  botaoEsqueciSenha: {
    marginTop: 20,
    alignItems: "center",
  },

  textoEsqueciSenha: {
    color: "#1454C7",
    fontSize: 14,
    fontWeight: "600",
  },

  rodape: {
    alignItems: "center",
    marginTop: 28,
  },

  rodapeSigla: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 3,
  },

  rodapeTexto: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },

  rodapeCampus: {
    color: "#D5E3FF",
    fontSize: 12,
    marginTop: 3,
  },
});
