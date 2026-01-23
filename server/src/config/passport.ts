import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { query } from '../database/db';
import { User } from '../types';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const result = await query(
      'SELECT id, username, email, full_name, avatar_url, provider, email_verified FROM users WHERE id = $1',
      [id]
    );
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email from Google'), undefined);
          }

          let result = await query(
            'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
            ['google', profile.id]
          );

          if (result.rows.length === 0) {
            const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(7);
            result = await query(
              `INSERT INTO users (username, email, full_name, avatar_url, provider, provider_id, email_verified)
               VALUES ($1, $2, $3, $4, $5, $6, $7)
               RETURNING *`,
              [
                username,
                email,
                profile.displayName,
                profile.photos?.[0]?.value,
                'google',
                profile.id,
                true,
              ]
            );
          }

          await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [
            result.rows[0].id,
          ]);

          return done(null, result.rows[0]);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
}

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/api/auth/facebook/callback',
        profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email from Facebook'), undefined);
          }

          let result = await query(
            'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
            ['facebook', profile.id]
          );

          if (result.rows.length === 0) {
            const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(7);
            const fullName = `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim();
            result = await query(
              `INSERT INTO users (username, email, full_name, avatar_url, provider, provider_id, email_verified)
               VALUES ($1, $2, $3, $4, $5, $6, $7)
               RETURNING *`,
              [
                username,
                email,
                fullName,
                profile.photos?.[0]?.value,
                'facebook',
                profile.id,
                true,
              ]
            );
          }

          await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [
            result.rows[0].id,
          ]);

          return done(null, result.rows[0]);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback',
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;

          let result = await query(
            'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
            ['github', profile.id]
          );

          if (result.rows.length === 0) {
            const username = profile.username || email.split('@')[0];
            result = await query(
              `INSERT INTO users (username, email, full_name, avatar_url, provider, provider_id, email_verified)
               VALUES ($1, $2, $3, $4, $5, $6, $7)
               RETURNING *`,
              [
                username,
                email,
                profile.displayName || profile.username,
                profile.photos?.[0]?.value,
                'github',
                profile.id,
                true,
              ]
            );
          }

          await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [
            result.rows[0].id,
          ]);

          return done(null, result.rows[0]);
        } catch (error) {
          return done(error, undefined);
        }
      }
    )
  );
}

export default passport;
