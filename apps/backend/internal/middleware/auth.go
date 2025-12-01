package middleware

import (
	"context"
	"net/http"
	"strings"

	"firebase.google.com/go/v4/auth"
	"github.com/labstack/echo/v4"
)

// AuthMiddleware returns an Echo middleware that validates Firebase ID tokens
func AuthMiddleware(authClient *auth.Client) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// 1. Get the Authorization header
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "missing authorization header"})
			}

			// 2. Remove "Bearer " prefix
			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenString == authHeader {
				// If the prefix wasn't there, the format is invalid
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid token format"})
			}

			// 3. Verify the token with Firebase
			token, err := authClient.VerifyIDToken(context.Background(), tokenString)
			if err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid or expired token"})
			}

			// 4. Store user info in context for the next handler to use
			// We can access this later using c.Get("uid")
			c.Set("uid", token.UID)
			c.Set("email", token.Claims["email"])

			return next(c)
		}
	}
}