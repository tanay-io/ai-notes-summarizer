import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {},
  callbacks: {
    authorized({ token }) {
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
