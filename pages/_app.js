import '../styles/globals.css'
import { UserProvider } from '../context/UserContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  // return <Component {...pageProps} />
  // return (
  //   <UserProvider>
  //     <ProtectedRoute>
  //       <Component {...pageProps} />
  //     </ProtectedRoute>
  //   </UserProvider>
  // );

  const router = useRouter();
  const isProtectedRoute = ['/dashboard'].includes(router.pathname);

  return (
    <UserProvider>
      {isProtectedRoute ? (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </UserProvider>
  );


}

export default MyApp
