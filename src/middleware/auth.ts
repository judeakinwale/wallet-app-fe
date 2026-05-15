// import {
//   DEFAULT_AUTHENTICATED_ROUTE,
//   DEFAULT_UNAUTHENTICATED_ROUTE,
//   PUBLIC_ROUTES,
// } from "@/constants/routes";
// import { getToken } from "@/utils/fetch";
// import { NextRequest, NextResponse } from "next/server";

// export function redirectMiddleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const token = getToken();

//   const isPublicRoute = PUBLIC_ROUTES.some((route) =>
//     pathname.startsWith(route),
//   );

//   if (token && isPublicRoute) {
//     return NextResponse.redirect(
//       new URL(DEFAULT_AUTHENTICATED_ROUTE, request.url),
//     );
//   }

//   if (!token && !isPublicRoute) {
//     return NextResponse.redirect(
//       new URL(DEFAULT_UNAUTHENTICATED_ROUTE, request.url),
//     );
//   }

//   return NextResponse.next();
// }
