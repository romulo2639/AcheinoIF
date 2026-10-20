
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { API_URL, getFotoUrl } from "../config/api";

// Lista local de demonstração. Não cadastra objetos no banco.
const ITENS_LOCAIS = [
  {
    id_objeto: "local-1",
    nome: "Mochila preta",
    descricao: "Mochila preta esquecida na sala de aula.",
    categoria: "Mochilas",
    status: "perdido",
    foto_principal: null,
  },
  {
    id_objeto: "local-2",
    nome: "Fone de ouvido Bluetooth",
    descricao: "Fone de ouvido sem fio encontrado no corredor.",
    categoria: "Eletrônicos",
    status: "perdido",
    foto_principal: null,
  },
  {
    id_objeto: "local-3",
    nome: "Garrafa azul",
    descricao: "Garrafa azul encontrada perto da biblioteca.",
    categoria: "Acessórios",
    status: "entregue",
    foto_principal: null,
  },
  {
    id_objeto: "local-4",
    nome: "Caderno de Matemática",
    descricao: "Caderno com anotações de matemática.",
    categoria: "Material Escolar",
    status: "perdido",
    foto_principal: null,
  },
  {
    id_objeto: "local-5",
    nome: "Carregador de celular",
    descricao: "Carregador branco encontrado na sala.",
    categoria: "Eletrônicos",
    status: "entregue",
    foto_principal: null,
  },
  {
    id_objeto: "local-6",
    nome: "Casaco cinza",
    descricao: "Casaco cinza esquecido no pátio.",
    categoria: "Roupas",
    status: "perdido",
    foto_principal: null,
  },
  {
    id_objeto: "local-7",
    nome: "Estojo escolar",
    descricao: "Estojo com lápis e canetas.",
    categoria: "Material Escolar",
    status: "entregue",
    foto_principal: null,
  },
  {
    id_objeto: "local-8",
    nome: "Chaveiro com chave",
    descricao: "Chave encontrada perto da entrada.",
    categoria: "Acessórios",
    status: "perdido",
    foto_principal: null,
  },
  {
    id_objeto: "local-9",
    nome: "Calculadora científica",
    descricao: "Calculadora científica preta.",
    categoria: "Material Escolar",
    status: "entregue",
    foto_principal: null,
  },
  {
    id_objeto: "local-10",
    nome: "Guarda-chuva",
    descricao: "Guarda-chuva preto esquecido no corredor.",
    categoria: "Acessórios",
    status: "perdido",
    foto_principal: null,
  },
];

const CATEGORIAS_LOCAIS = [
  "Material Escolar",
  "Eletrônicos",
  "Roupas",
  "Mochilas",
  "Acessórios",
];

const STATUS = [
  { valor: "todos", texto: "Todos" },
  { valor: "perdido", texto: "Perdidos" },
  { valor: "entregue", texto: "Encontrados" },
];

function normalizarTexto(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function nomeDoItem(item) {
  return (
    item.nome ??
    item.nome_objeto ??
    item.titulo ??
    item.nomeObjeto ??
    "Objeto sem nome"
  );
}

function descricaoDoItem(item) {
  return (
    item.descricao ??
    item.descricao_objeto ??
    item.descricaoObjeto ??
    ""
  );
}

function categoriaDoItem(item) {
  if (typeof item.categoria === "string") {
    return item.categoria;
  }

  return (
    item.categoria?.nome ??
    item.nome_categoria ??
    item.categoria_nome ??
    "Sem categoria"
  );
}

function textoStatus(status) {
  const valor = normalizarTexto(status);

  if (valor === "perdido" || valor === "perdida") {
    return "Perdido";
  }

  if (
    valor === "entregue" ||
    valor === "encontrado" ||
    valor === "encontrada"
  ) {
    return "Encontrado";
  }

  return status || "Sem status";
}

function normalizarStatus(status) {
  const valor = normalizarTexto(status);

  if (["perdido", "perdida"].includes(valor)) {
    return "perdido";
  }

  if (
    ["entregue", "encontrado", "encontrada"].includes(valor)
  ) {
    return "entregue";
  }

  return valor;
}

export default function HomeScreen({ onLogout }) {
  const { width } = useWindowDimensions();

  const [itens, setItens] = useState(ITENS_LOCAIS);
  const [categorias, setCategorias] = useState(CATEGORIAS_LOCAIS);
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState("Todas");
  const [statusSelecionado, setStatusSelecionado] =
    useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const carregarDados = useCallback(async () => {
    try {
      const [respostaItens, respostaCategorias] =
        await Promise.all([
          fetch(`${API_URL}/itens`),
          fetch(`${API_URL}/categorias`),
        ]);

      if (!respostaItens.ok) {
        throw new Error("Não foi possível carregar os objetos.");
      }

      const dadosItens = await respostaItens.json();
      const listaItens = Array.isArray(dadosItens)
        ? dadosItens
        : [];

      setItens(
        listaItens.length > 0 ? listaItens : ITENS_LOCAIS
      );

      if (respostaCategorias.ok) {
        const dadosCategorias = await respostaCategorias.json();

        const nomesCategorias = (
          Array.isArray(dadosCategorias) ? dadosCategorias : []
        )
          .map((categoria) =>
            typeof categoria === "string"
              ? categoria
              : categoria.nome ??
                categoria.nome_categoria ??
                ""
          )
          .filter(Boolean);

        setCategorias(
          nomesCategorias.length > 0
            ? nomesCategorias
            : CATEGORIAS_LOCAIS
        );
      } else {
        setCategorias(CATEGORIAS_LOCAIS);
      }
    } catch (erro) {
      console.log(
        "Usando lista local de objetos:",
        erro.message
      );
      setItens(ITENS_LOCAIS);
      setCategorias(CATEGORIAS_LOCAIS);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const atualizarLista = useCallback(() => {
    setAtualizando(true);
    carregarDados();
  }, [carregarDados]);

  const itensFiltrados = useMemo(() => {
    const termo = normalizarTexto(busca);

    return itens.filter((item) => {
      const nome = normalizarTexto(nomeDoItem(item));
      const descricao = normalizarTexto(descricaoDoItem(item));
      const categoria = normalizarTexto(categoriaDoItem(item));

      const correspondeBusca =
        !termo ||
        nome.includes(termo) ||
        descricao.includes(termo) ||
        categoria.includes(termo);

      const correspondeCategoria =
        categoriaSelecionada === "Todas" ||
        categoria === normalizarTexto(categoriaSelecionada);

      const correspondeStatus =
        statusSelecionado === "todos" ||
        normalizarStatus(item.status) === statusSelecionado;

      return (
        correspondeBusca &&
        correspondeCategoria &&
        correspondeStatus
      );
    });
  }, [
    itens,
    busca,
    categoriaSelecionada,
    statusSelecionado,
  ]);

  const sair = async () => {
    try {
      if (onLogout) {
        await onLogout();
      } else if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (erro) {
      console.log("Erro ao sair:", erro.message);
    }
  };

  const renderItem = ({ item }) => {
    const foto = item.foto_principal
      ? getFotoUrl(item.foto_principal)
      : null;

    const encontrado =
      normalizarStatus(item.status) === "entregue";

    return (
      <View style={styles.card}>
        {foto ? (
          <Image
            source={{ uri: foto }}
            style={styles.foto}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.semFoto}>
            <Text style={styles.emojiFoto}>📦</Text>
            <Text style={styles.textoSemFoto}>Sem foto</Text>
          </View>
        )}

        <View style={styles.cardConteudo}>
          <Text style={styles.nomeItem}>
            {nomeDoItem(item)}
          </Text>

          <Text style={styles.descricaoItem}>
            {descricaoDoItem(item) ||
              "Sem descrição disponível."}
          </Text>

          <Text style={styles.categoriaItem}>
            {categoriaDoItem(item)}
          </Text>

          <View
            style={[
              styles.statusBadge,
              encontrado
                ? styles.statusEncontrado
                : styles.statusPerdido,
            ]}
          >
            <Text style={styles.statusTexto}>
              {textoStatus(item.status)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (carregando) {
    return (
      <View style={styles.telaCarregando}>
        <ActivityIndicator size="large" color="#176B45" />
        <Text style={styles.textoCarregando}>
          Carregando objetos...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <View style={styles.cabecalhoTexto}>
          <Text style={styles.titulo}>AchouNoIF</Text>
          <Text style={styles.subtitulo}>
            Encontre objetos perdidos no IFPE
          </Text>
        </View>

        <TouchableOpacity
          style={styles.botaoSair}
          onPress={sair}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
        >
          <Text style={styles.textoBotaoSair}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.areaBusca}>
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar objeto..."
          placeholderTextColor="#777"
          value={busca}
          onChangeText={setBusca}
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Buscar objetos"
        />

        {busca.length > 0 && (
          <TouchableOpacity
            style={styles.botaoLimpar}
            onPress={() => setBusca("")}
          >
            <Text style={styles.textoLimpar}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.tituloFiltro}>Categorias</Text>

      {/* Lista horizontal com altura própria para não cortar os botões */}
      <FlatList
        horizontal
        data={[
          "Todas",
          ...categorias.filter(
            (categoria) =>
              normalizarTexto(categoria) !== "todas"
          ),
        ]}
        keyExtractor={(item, index) => `${item}-${index}`}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        style={styles.categoriasLista}
        contentContainerStyle={styles.listaCategorias}
        renderItem={({ item }) => {
          const selecionada =
            categoriaSelecionada === item;

          return (
            <TouchableOpacity
              style={[
                styles.botaoCategoria,
                selecionada && styles.categoriaSelecionada,
              ]}
              onPress={() => setCategoriaSelecionada(item)}
            >
              <Text
                style={[
                  styles.textoCategoria,
                  selecionada &&
                    styles.textoCategoriaSelecionada,
                ]}
                numberOfLines={1}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <Text style={styles.tituloFiltro}>Status</Text>

      <View style={styles.listaStatus}>
        {STATUS.map((status) => {
          const selecionado =
            statusSelecionado === status.valor;

          return (
            <TouchableOpacity
              key={status.valor}
              style={[
                styles.botaoStatus,
                selecionado && styles.statusSelecionado,
              ]}
              onPress={() =>
                setStatusSelecionado(status.valor)
              }
            >
              <Text
                style={[
                  styles.textoStatusFiltro,
                  selecionado &&
                    styles.textoStatusSelecionado,
                ]}
              >
                {status.texto}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.linhaResultados}>
        <Text style={styles.tituloLista}>
          Objetos disponíveis
        </Text>
        <Text style={styles.contadorResultados}>
          {itensFiltrados.length} resultado(s)
        </Text>
      </View>

      <FlatList
        key={width < 600 ? "lista" : "grade"}
        data={itensFiltrados}
        keyExtractor={(item, index) =>
          String(
            item.id_objeto ??
              item.id ??
              item.id_item ??
              `objeto-${index}`
          )
        }
        renderItem={renderItem}
        numColumns={width < 600 ? 1 : 2}
        columnWrapperStyle={
          width < 600 ? undefined : styles.linhaGrade
        }
        contentContainerStyle={styles.listaObjetos}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={atualizarLista}
            colors={["#176B45"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.semResultados}>
            <Text style={styles.emojiVazio}>🔎</Text>
            <Text style={styles.textoVazio}>
              Nenhum objeto encontrado.
            </Text>
            <Text style={styles.dicaVazio}>
              Tente mudar a busca ou os filtros.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F5",
    paddingTop: 45,
  },

  telaCarregando: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F7F5",
  },

  textoCarregando: {
    marginTop: 12,
    fontSize: 15,
    color: "#444",
  },

  cabecalho: {
    backgroundColor: "#176B45",
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cabecalhoTexto: {
    flex: 1,
    marginRight: 12,
  },

  titulo: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  subtitulo: {
    marginTop: 4,
    color: "#E2F2E8",
    fontSize: 13,
  },

  botaoSair: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },

  textoBotaoSair: {
    color: "#176B45",
    fontWeight: "bold",
  },

  areaBusca: {
    marginHorizontal: 16,
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  inputBusca: {
    flex: 1,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderColor: "#D7E0DA",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#222",
  },

  botaoLimpar: {
    marginLeft: 8,
    padding: 8,
  },

  textoLimpar: {
    color: "#176B45",
    fontWeight: "600",
  },

  tituloFiltro: {
    marginTop: 17,
    marginHorizontal: 18,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "bold",
    color: "#26352C",
  },

  // A lista tem altura própria e não encolhe verticalmente.
  categoriasLista: {
    flexGrow: 0,
    flexShrink: 0,
    height: 48,
  },

  listaCategorias: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: "center",
    gap: 8,
  },

  botaoCategoria: {
    flexShrink: 0,
    alignSelf: "center",
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C8D6CC",
    backgroundColor: "#FFFFFF",
  },

  categoriaSelecionada: {
    backgroundColor: "#176B45",
    borderColor: "#176B45",
  },

  textoCategoria: {
    color: "#35443A",
    fontSize: 13,
  },

  textoCategoriaSelecionada: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  listaStatus: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
  },

  botaoStatus: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C8D6CC",
    backgroundColor: "#FFFFFF",
  },

  statusSelecionado: {
    backgroundColor: "#DDEFE4",
    borderColor: "#176B45",
  },

  textoStatusFiltro: {
    fontSize: 13,
    color: "#35443A",
  },

  textoStatusSelecionado: {
    color: "#176B45",
    fontWeight: "bold",
  },

  linhaResultados: {
    marginTop: 20,
    marginHorizontal: 18,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  tituloLista: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: "bold",
    color: "#26352C",
  },

  contadorResultados: {
    fontSize: 12,
    color: "#617067",
  },

  listaObjetos: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  linhaGrade: {
    gap: 12,
  },

  card: {
    flex: 1,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E1E8E3",
  },

  foto: {
    width: "100%",
    height: 155,
    backgroundColor: "#E8EEE9",
  },

  semFoto: {
    height: 115,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8EEE9",
  },

  emojiFoto: {
    fontSize: 35,
  },

  textoSemFoto: {
    marginTop: 4,
    fontSize: 12,
    color: "#68766D",
  },

  cardConteudo: {
    padding: 14,
  },

  nomeItem: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#26352C",
  },

  descricaoItem: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: "#59665E",
  },

  categoriaItem: {
    marginTop: 10,
    fontSize: 12,
    color: "#176B45",
    fontWeight: "600",
  },

  statusBadge: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  statusEncontrado: {
    backgroundColor: "#DDEFE4",
  },

  statusPerdido: {
    backgroundColor: "#FCE8D9",
  },

  statusTexto: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#35443A",
  },

  semResultados: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 45,
  },

  emojiVazio: {
    fontSize: 38,
  },

  textoVazio: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "bold",
    color: "#35443A",
  },

  dicaVazio: {
    marginTop: 6,
    fontSize: 13,
    color: "#68766D",
    textAlign: "center",
  },
});
