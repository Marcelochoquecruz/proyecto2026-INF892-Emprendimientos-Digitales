const SHOPIFY_GRAPHQL_URL =
  "https://scs8i4-11.myshopify.com/admin/api/2024-04/graphql.json";
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!SHOPIFY_ACCESS_TOKEN) {
  throw new Error("Missing SHOPIFY_ADMIN_ACCESS_TOKEN environment variable.");
}

const collections = [
  {
    title: "Cuadros con Pigmentos Minerales",
    tag: "cuadros-pigmentos",
  },
  {
    title: "Artesanías en Minerales",
    tag: "artesanias-minerales",
  },
  {
    title: "Piezas de Colección Exclusivas",
    tag: "piezas-exclusivas",
  },
];

const mutation = `
  mutation CollectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function createSmartCollection(collection) {
  const response = await fetch(SHOPIFY_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          title: collection.title,
          ruleSet: {
            appliedDisjunctively: false,
            rules: [
              {
                column: "TAG",
                relation: "EQUALS",
                condition: collection.tag,
              },
            ],
          },
        },
      },
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText}: ${JSON.stringify(result)}`
    );
  }

  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }

  const payload = result.data.collectionCreate;

  if (payload.userErrors.length > 0) {
    throw new Error(
      `Shopify user errors: ${JSON.stringify(payload.userErrors)}`
    );
  }

  return payload.collection;
}

async function main() {
  for (const collection of collections) {
    const createdCollection = await createSmartCollection(collection);
    console.log(`${createdCollection.title}: ${createdCollection.id}`);
  }
}

main().catch((error) => {
  console.error("No se pudieron crear las colecciones.");
  console.error(error.message);
  process.exitCode = 1;
});
