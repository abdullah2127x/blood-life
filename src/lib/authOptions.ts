import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/User";
import { comparePassword } from "@/lib/hash";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials: Record<string, string> | undefined) {
//         if (!credentials) throw new Error("Please provide email and password");

//         await connectDB();
//         const cleanEmail = credentials.email.trim().toLowerCase();
//         const user = await User.findOne({ email: cleanEmail });

//         if (!user) throw new Error("No account found with this email address");
//         if (!user.password) throw new Error("Invalid login method");

//         const isValid = await comparePassword(
//           credentials.password,
//           user.password
//         );
//         if (!isValid) throw new Error("Invalid password");

//         return {
//           id: user._id,
//           email: user.email,
//           name: user.name,
//           lastName: user.lastName,
//           phone: user.phone,
//         };
//       },
//     }),
//   ],
//   session: { strategy: "jwt" as const },
//   callbacks: {
//     async jwt({ token, user }: any) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.name = user.name;
//         token.lastName = user.lastName;
//         token.phone = user.phone;
//       } else if (token.id) {
//         try {
//           await connectDB();
//           const freshUser = await User.findById(token.id);
//           if (freshUser) {
//             token.name = freshUser.name;
//             token.lastName = freshUser.lastName;
//             token.email = freshUser.email;
//             token.phone = freshUser.phone;
//             token.lastUpdated = freshUser.updatedAt;
//           }
//         } catch (error) {
//           console.error("JWT callback - error:", error);
//         }
//       }
//       return token;
//     },
//     async session({ session, token }: any) {
//       if (token) {
//         session.user.id = token.id;
//         session.user.email = token.email;
//         session.user.name = token.name;
//         session.user.lastName = token.lastName;
//         session.user.phone = token.phone;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/authentication/login",
//     error: "/authentication/login",
//   },
//   debug: process.env.NODE_ENV === "development",
// };




export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) {
          throw new Error("Please provide email and password");
        }

        await connectDB();
        const cleanEmail = credentials.email.trim().toLowerCase();
        const user = await User.findOne({ email: cleanEmail });

        console.log("🔍 [AUTH] User found in database:", {
          id: user?._id,
          email: user?.email,
          name: user?.name,
          lastName: user?.lastName,
          phone: user?.phone,
        });

        if (!user) {
          throw new Error("No account found with this email address");
        }

        if (!user.password) {
          throw new Error("Invalid login method");
        }

        const isValid = await comparePassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        const userData = {
          id: user._id, 
          email: user.email, 
          name: user.name,
          lastName: user.lastName,
          phone: user.phone,
        };

        console.log("🔍 [AUTH] Returning user data:", userData);
        return userData;
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        console.log("🔐 JWT callback - user data:", user);
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.lastName = user.lastName;
        token.phone = user.phone;
        console.log("🔐 JWT callback - final token:", token);
      } else if (token.id) {
        // Fetch fresh user data from database to ensure token is up to date
        try {
          await connectDB();
          const freshUser = await User.findById(token.id);
          if (freshUser) {
            // Check if user data has been updated since last token generation
            const tokenLastUpdated = token.lastUpdated;
            const userLastUpdated = freshUser.updatedAt;
            
            if (!tokenLastUpdated || !userLastUpdated || userLastUpdated > tokenLastUpdated) {
              console.log("🔐 JWT callback - updating token with fresh data:", {
                name: freshUser.name,
                lastName: freshUser.lastName,
                email: freshUser.email,
                phone: freshUser.phone,
                lastUpdated: freshUser.updatedAt
              });
              token.name = freshUser.name;
              token.lastName = freshUser.lastName;
              token.email = freshUser.email;
              token.phone = freshUser.phone;
              token.lastUpdated = freshUser.updatedAt;
            }
          }
        } catch (error) {
          console.error("🔐 JWT callback - error fetching fresh user data:", error);
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        console.log("📋 Session callback - token data:", token);
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.lastName = token.lastName;
        session.user.phone = token.phone;
        console.log("📋 Session callback - final session:", session);
      }
      return session;
    },
  },
  pages: {
    signIn: "/authentication/login",
    error: "/authentication/login",
  },
  debug: process.env.NODE_ENV === "development",
};
