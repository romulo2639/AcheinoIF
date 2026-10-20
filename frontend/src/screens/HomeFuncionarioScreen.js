import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";

const estatisticas = [
  { titulo: "Encontrados", valor: 28, cor: "#1685E8", fundo: "#EFF8FF" },
  { titulo: "Perdidos", valor: 12, cor: "#F5A500", fundo: "#FFFAE9" },
  {
    titulo: "Aguardando devolução",
    valor: 18,
    cor: "#079455",
    fundo: "#EFFAF3",
  },
  { titulo: "Devolvidos", valor: 64, cor: "#7945E8", fundo: "#F6F0FF" },
];

const ocorrencias = [
  {
    objeto: "Fone de ouvido",
    local: "Bloco A - Sala 103",
    status: "Aguardando devolução",
    data: "20/05/2024",
    icone: "🎧",
  },
  {
    objeto: "Mochila azul",
    local: "Refeitório",
    status: "Aguardando devolução",
    data: "19/05/2024",
    icone: "🎒",
  },
  {
    objeto: "Carteira preta",
    local: "Biblioteca",
    status: "Devolvido",
    data: "18/05/2024",
    icone: "👛",
  },
];

export default function HomeFuncionarioScreen({
  onSair,
  onBuscarOcorrencias,
  onCadastrarObjeto,
  onGerenciarOcorrencias,
  onVerRelatorios,
  onConfiguracoes,
}) {
  const acoes = [
    {
      titulo: "Buscar\nocorrências",
      icone: "🔎",
      acao: onBuscarOcorrencias,
    },
    {
      titulo: "Cadastrar\nobjeto",
      icone: "➕",
      acao: onCadastrarObjeto,
    },
    {
      titulo: "Gerenciar\nocorrências",
      icone: "📋",
      acao: onGerenciarOcorrencias,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#006B3C" barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerTexto}>
            <Text style={styles.saudacao}>Olá, Funcionário!</Text>
            <Text style={styles.subtituloHeader}>
              Bem-vindo ao painel administrativo
            </Text>
          </View>

          <TouchableOpacity
            style={styles.botaoSair}
            onPress={onSair}
            accessibilityLabel="Sair da conta"
          >
            <Text style={styles.textoSair}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* Apresentação */}
        <View style={styles.cartaoApresentacao}>
          <Text style={styles.escudo}>🛡️</Text>

          <View style={styles.apresentacaoTexto}>
            <Text style={styles.tituloApresentacao}>
              Painel do Funcionário
            </Text>
            <Text style={styles.descricao}>
              Gerencie objetos encontrados e perdidos, acompanhe ocorrências
              e ajude a devolver pertences aos seus donos.
            </Text>
          </View>
        </View>

        {/* Estatísticas */}
        <View style={styles.tituloLinha}>
          <Text style={styles.tituloSecao}>Resumo geral</Text>
          <Text style={styles.atualizado}>Dados de demonstração</Text>
        </View>

        <View style={styles.gradeEstatisticas}>
          {estatisticas.map((item) => (
            <View
              key={item.titulo}
              style={[
                styles.cartaoEstatistica,
                { backgroundColor: item.fundo },
              ]}
            >
              <Text style={[styles.numero, { color: item.cor }]}>
                {item.valor}
              </Text>
              <Text style={styles.nomeEstatistica}>{item.titulo}</Text>
            </View>
          ))}
        </View>

        {/* Ações rápidas */}
        <Text style={styles.tituloSecao}>Ações rápidas</Text>

        <View style={styles.gradeAcoes}>
          {acoes.map((item) => (
            <TouchableOpacity
              key={item.titulo}
              style={styles.cartaoAcao}
              onPress={item.acao}
              activeOpacity={0.7}
            >
              <Text style={styles.iconeAcao}>{item.icone}</Text>
              <Text style={styles.textoAcao}>{item.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ocorrências recentes */}
        <View style={styles.tituloLinha}>
          <Text style={styles.tituloSecao}>Ocorrências recentes</Text>

          <TouchableOpacity onPress={onGerenciarOcorrencias}>
            <Text style={styles.verTodas}>Ver todas ›</Text>
          </TouchableOpacity>
        </View>

        {ocorrencias.map((item) => (
          <TouchableOpacity
            key={item.objeto}
            style={styles.cartaoOcorrencia}
            onPress={onGerenciarOcorrencias}
            activeOpacity={0.7}
          >
            <View style={styles.iconeObjeto}>
              <Text style={styles.emojiObjeto}>{item.icone}</Text>
            </View>

            <View style={styles.detalhesOcorrencia}>
              <Text style={styles.nomeObjeto}>{item.objeto}</Text>
              <Text style={styles.localObjeto}>📍 {item.local}</Text>

              <Text
                style={[
                  styles.statusObjeto,
                  item.status === "Devolvido"
                    ? styles.statusDevolvido
                    : styles.statusPendente,
                ]}
              >
                ● {item.status}
              </Text>
            </View>

            <Text style={styles.seta}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Relatórios e configurações */}
        <View style={styles.rodapeAcoes}>
          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={onVerRelatorios}
          >
            <Text style={styles.textoBotaoSecundario}>
              📊  Relatórios
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={onConfiguracoes}
          >
            <Text style={styles.textoBotaoSecundario}>
              ⚙️  Configurações
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.rodape}>
          AchouNoIF • Painel administrativo
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  conteudo: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: "#006B3C",
    paddingHorizontal: 22,
    paddingTop: 45,
    paddingBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTexto: {
    flex: 1,
    marginRight: 10,
  },
  saudacao: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtituloHeader: {
    color: "#E2F5E9",
    fontSize: 13,
    marginTop: 5,
  },
  botaoSair: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  textoSair: {
    color: "#006B3C",
    fontWeight: "bold",
  },
  cartaoApresentacao: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 20,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  escudo: {
    fontSize: 42,
    marginRight: 15,
  },
  apresentacaoTexto: {
    flex: 1,
  },
  tituloApresentacao: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#17212B",
    marginBottom: 8,
  },
  descricao: {
    color: "#5C6678",
    fontSize: 14,
    lineHeight: 21,
  },
  tituloLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 14,
  },
  tituloSecao: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#006B3C",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 14,
  },
  atualizado: {
    fontSize: 11,
    color: "#6B7280",
  },
  gradeEstatisticas: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  cartaoEstatistica: {
    width: "48%",
    minHeight: 120,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginBottom: 12,
  },
  numero: {
    fontSize: 32,
    fontWeight: "bold",
  },
  nomeEstatistica: {
    fontSize: 13,
    color: "#344054",
    textAlign: "center",
    marginTop: 5,
  },
  gradeAcoes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  cartaoAcao: {
    width: "48%",
    minHeight: 112,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    elevation: 2,
  },
  iconeAcao: {
    fontSize: 27,
    marginBottom: 9,
  },
  textoAcao: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#202938",
    lineHeight: 20,
  },
  verTodas: {
    color: "#00834A",
    fontWeight: "600",
    fontSize: 14,
  },
  cartaoOcorrencia: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 13,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },
  iconeObjeto: {
    width: 54,
    height: 54,
    backgroundColor: "#EDF5F0",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  emojiObjeto: {
    fontSize: 27,
  },
  detalhesOcorrencia: {
    flex: 1,
  },
  nomeObjeto: {
    color: "#17212B",
    fontSize: 15,
    fontWeight: "bold",
  },
  localObjeto: {
    color: "#667085",
    fontSize: 12,
    marginTop: 5,
  },
  statusObjeto: {
    fontSize: 11,
    marginTop: 6,
  },
  statusPendente: {
    color: "#079455",
  },
  statusDevolvido: {
    color: "#1685E8",
  },
  seta: {
    fontSize: 28,
    color: "#00834A",
    marginLeft: 8,
  },
  rodapeAcoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 15,
  },
  botaoSecundario: {
    flex: 1,
    backgroundColor: "#E8F5EC",
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  textoBotaoSecundario: {
    color: "#006B3C",
    fontSize: 12,
    fontWeight: "bold",
  },
  rodape: {
    textAlign: "center",
    color: "#98A2B3",
    marginTop: 25,
    fontSize: 12,
  },
});