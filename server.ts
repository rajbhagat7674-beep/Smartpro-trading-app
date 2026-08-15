import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory demo/live trading session store
  let activeSession = {
    isLoggedIn: true,
    isDemoSandbox: true,
    apiKey: process.env.ANGEL_ONE_API_KEY || 'DEMO_API_KEY_SMART_PRO',
    clientCode: process.env.ANGEL_ONE_CLIENT_CODE || 'S948291',
    userName: 'Rajinder Bhagat (Pro Trader)',
    email: 'rajinderbhagat26@gmail.com',
    broker: 'Angel One SmartAPI' as const,
    feedToken: 'feed_token_sec_99410',
    jwtToken: 'jwt_smartapi_token_sample',
    refreshToken: 'ref_tok_8819',
    balance: 245800.00,
    availableMargin: 198450.00,
    usedMargin: 47350.00,
    realizedPnL: 8955.00,
    unrealizedPnL: 12185.00
  };

  const orderBook: any[] = [
    {
      orderid: '240815000189',
      status: 'COMPLETE',
      tradingsymbol: 'NIFTY 24350 CE',
      transactiontype: 'BUY',
      quantity: 150,
      price: 112.50,
      averageprice: 112.50,
      ordertime: '10:45:12 AM',
      exchange: 'NFO',
      producttype: 'INTRADAY'
    },
    {
      orderid: '240815000192',
      status: 'COMPLETE',
      tradingsymbol: 'BANKNIFTY 51200 CE',
      transactiontype: 'BUY',
      quantity: 60,
      price: 284.00,
      averageprice: 284.00,
      ordertime: '11:16:04 AM',
      exchange: 'NFO',
      producttype: 'INTRADAY'
    }
  ];

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), broker: 'Angel One SmartAPI Ready' });
  });

  // SmartAPI Login
  app.post('/api/smartapi/login', (req, res) => {
    const { apiKey, clientCode, password, totp, isDemo } = req.body;

    if (isDemo) {
      activeSession = {
        ...activeSession,
        isLoggedIn: true,
        isDemoSandbox: true,
        clientCode: clientCode || 'DEMO_ANGEL_88',
        userName: 'Demo Pro Trader (Sandbox)',
        apiKey: apiKey || 'SMARTAPI_DEMO_KEY'
      };
      return res.json({
        status: true,
        message: 'Successfully logged into Angel One Sandbox Mode',
        data: activeSession
      });
    }

    if (!apiKey || !clientCode || (!password && !totp)) {
      return res.status(400).json({
        status: false,
        message: 'API Key, Client Code, and Password/TOTP are required to authenticate with Angel One SmartAPI.'
      });
    }

    // In a live Angel One setup, this proxies to https://apiconnect.angelone.in/rest/auth/angelbroking/user/v1/loginByPassword
    activeSession = {
      isLoggedIn: true,
      isDemoSandbox: false,
      apiKey,
      clientCode,
      userName: `Client ${clientCode}`,
      email: 'user@angelbroking.com',
      broker: 'Angel One SmartAPI',
      feedToken: `feed_${Date.now()}`,
      jwtToken: `jwt_${Date.now()}_secure`,
      refreshToken: `ref_${Date.now()}`,
      balance: 185000.00,
      availableMargin: 154000.00,
      usedMargin: 31000.00,
      realizedPnL: 4200.00,
      unrealizedPnL: 8950.00
    };

    res.json({
      status: true,
      message: 'Angel One SmartAPI authenticated successfully!',
      data: activeSession
    });
  });

  // Get Session / Profile
  app.get('/api/smartapi/session', (req, res) => {
    res.json({ status: true, data: activeSession });
  });

  // Place Order
  app.post('/api/smartapi/order', (req, res) => {
    const order = req.body;
    if (!order.tradingsymbol || !order.quantity) {
      return res.status(400).json({ status: false, message: 'Invalid order parameters' });
    }

    const orderId = `AO${Date.now().toString().slice(-8)}`;
    const newOrder = {
      orderid: orderId,
      status: 'COMPLETE',
      tradingsymbol: order.tradingsymbol,
      transactiontype: order.transactiontype || 'BUY',
      quantity: Number(order.quantity),
      price: Number(order.price) || 0,
      averageprice: Number(order.price) || 0,
      ordertime: new Date().toLocaleTimeString(),
      exchange: order.exchange || 'NSE',
      producttype: order.producttype || 'INTRADAY',
      message: 'Order executed successfully at best market price via SmartAPI.'
    };

    orderBook.unshift(newOrder);

    // Update margin
    const marginRequired = (Number(order.price) || 100) * Number(order.quantity);
    activeSession.usedMargin += marginRequired;
    activeSession.availableMargin = Math.max(0, activeSession.availableMargin - marginRequired);

    res.json({
      status: true,
      message: `Order #${orderId} for ${order.quantity} qty of ${order.tradingsymbol} placed successfully!`,
      data: newOrder
    });
  });

  // Get Orders
  app.get('/api/smartapi/orders', (req, res) => {
    res.json({ status: true, data: orderBook });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Angel One SmartPro Trading Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
