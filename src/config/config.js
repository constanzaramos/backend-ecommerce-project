export const config = {
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || "localhost",
    nodeEnv: process.env.NODE_ENV || "development",
  },

  database: {
    productsFile: "src/data/products.json",
    cartsFile: "src/data/carts.json",
  },
  validation: {
    product: {
      title: {
        minLength: 3,
        maxLength: 100,
      },
      description: {
        minLength: 10,
        maxLength: 500,
      },
      price: {
        min: 0,
      },
      stock: {
        min: 0,
      },
      category: {
        minLength: 2,
        maxLength: 50,
      },
      code: {
        minLength: 3,
        maxLength: 20,
      },
    },
    cart: {
      quantity: {
        min: 1,
      },
    },
  },

  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
    defaultPage: 1,
  },

  limits: {
    jsonSize: "10mb",
    urlEncoded: "10mb",
  },

  logging: {
    level: process.env.LOG_LEVEL || "info",
    enableConsole: process.env.LOG_CONSOLE !== "false",
    enableFile: process.env.LOG_FILE === "true",
  },
};

export const validateConfig = () => {
  const errors = [];

  if (!config.server.port || isNaN(config.server.port)) {
    errors.push("PORT debe ser un número válido");
  }

  if (config.validation.product.price.min < 0) {
    errors.push("El precio mínimo no puede ser negativo");
  }

  if (config.validation.product.stock.min < 0) {
    errors.push("El stock mínimo no puede ser negativo");
  }

  if (config.pagination.maxLimit < config.pagination.defaultLimit) {
    errors.push(
      "El límite máximo debe ser mayor o igual al límite por defecto"
    );
  }

  if (errors.length > 0) {
    throw new Error(`Errores de configuración: ${errors.join(", ")}`);
  }

  return true;
};

export const getEnvironmentConfig = () => {
  const env = config.server.nodeEnv;

  switch (env) {
    case "production":
      return {
        ...config,
        logging: {
          ...config.logging,
          level: "error",
          enableConsole: true,
          enableFile: true,
        },
      };

    case "development":
      return {
        ...config,
        logging: {
          ...config.logging,
          level: "debug",
          enableConsole: true,
          enableFile: false,
        },
      };

    case "test":
      return {
        ...config,
        server: {
          ...config.server,
          port: 0,
        },
        logging: {
          ...config.logging,
          level: "error",
          enableConsole: false,
          enableFile: false,
        },
      };

    default:
      return config;
  }
};
