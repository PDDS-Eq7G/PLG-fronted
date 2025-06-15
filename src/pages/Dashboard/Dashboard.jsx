import './Dashboard.css';
import MainLayout from '../../layouts/MainLayout/MainLayout';

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="dashboard-content">
        <h1>Bienvenido al Sistema de Planificación y Monitoreo Logístico de PLG</h1>
        <p>En PLG, estamos comprometidos con brindar un servicio eficiente, seguro y puntual en la distribución de Gas Licuado de Petróleo (GLP) a nuestros clientes industriales, comerciales y residenciales en la ciudad XYZ. Con el objetivo de mantener nuestra política de cero incumplimientos en los plazos de entrega, hemos desarrollado esta plataforma tecnológica que moderniza y optimiza nuestras operaciones logísticas.</p>
        <p>Este sistema ha sido diseñado para abordar los principales desafíos que enfrentamos: el registro y validación oportuna de pedidos, la planificación dinámica de rutas de distribución, y el monitoreo gráfico en tiempo real de todas las operaciones. De esta forma, aseguramos un control integral desde que se genera el pedido hasta su entrega final.</p>
        <p>El sistema cuenta con tres componentes principales:</p>        
        <ol>
            <li>
                <b>Registro de Pedidos:</b> Permite ingresar solicitudes de forma segura, asegurando el cumplimiento de las condiciones mínimas de atención, como el aviso con al menos 4 horas de anticipación.
            </li>
            <li>
                <b>Planificación y Simulación de Rutas:</b> Asigna las rutas óptimas a los camiones cisterna considerando capacidades de carga, distancias, consumo de combustible y disponibilidad de flota. Además, permite simular escenarios operativos, tanto semanales como de alta demanda, para prever posibles cuellos de botella.
            </li>
            <li>
                <b>Monitoreo Gráfico en Tiempo Real:</b> A través de un panel visual, muestra el estado de los pedidos, rutas asignadas, ubicación de vehículos y desempeño general de las operaciones.
            </li>
        </ol>        
        <p>Esta herramienta representa un paso clave hacia una logística inteligente, con decisiones basadas en datos, eficiencia en la distribución y satisfacción del cliente.</p>
        <p class="signature">¡Gracias por ser parte de esta transformación!</p>
      </div>
    </MainLayout>
  );
};

export default Dashboard;