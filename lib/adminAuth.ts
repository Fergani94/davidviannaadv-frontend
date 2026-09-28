import { GetServerSideProps } from 'next';

// Shared gate for admin pages: no cookie -> login. The token is handed to the page (same pattern as /admin/depoimentos).
export const exigirLogin: GetServerSideProps<{ token: string }> = async ({ req }) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }

  return { props: { token } };
};
