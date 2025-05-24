import {
  User as AuthUser,
  AuthError,
  isAuthError,
} from "@supabase/supabase-js";
import { adminSupabaseClient } from "../../supabase/client";
import { UserRow, UserInsertInput } from "./types";
import {
  usersRowSchema,
  usersInsertSchema,
} from "../../supabase/generated.schemas";

/**
 * Finds a user by phone number using admin privileges
 * @param phoneNumber - The phone number to search for
 * @returns Promise resolving to the found user or null
 */
export async function findAuthUserByPhoneWithAdmin(
  phoneNumber: string
): Promise<AuthUser | null> {
  console.log(`findAuthUserByPhoneWithAdmin: Searching for ${phoneNumber}`);
  try {
    const {
      data: { users },
      error,
    } = await adminSupabaseClient.auth.admin.listUsers({
      page: 1,
      perPage: 10000,
    });
    if (error) {
      console.error("findAuthUserByPhoneWithAdmin: listUsers error", error);
      return null;
    }
    if (!users) {
      console.error("findAuthUserByPhoneWithAdmin: No users array returned.");
      return null;
    }
    for (const user of users) {
      if (user.phone === phoneNumber) {
        console.log(`findAuthUserByPhoneWithAdmin: Found user ID ${user.id}`);
        return user;
      }
    }
    console.log(
      `findAuthUserByPhoneWithAdmin: No user found for ${phoneNumber}`
    );
    return null;
  } catch (e: any) {
    console.error(`findAuthUserByPhoneWithAdmin: Exception: ${e.message}`, e);
    return null;
  }
}

/**
 * Creates a new user with a profile using admin privileges
 * @param phoneNumber - Phone number for the new user
 * @param tenantId - Tenant ID to associate with the user
 * @returns Promise resolving to the created user profile or null
 */
export async function createUserWithProfileAndAdmin(
  phoneNumber: string,
  tenantId: string
): Promise<UserRow | null> {
  console.log(
    `createUserWithProfileAndAdmin: Attempting for phone: ${phoneNumber}`
  );
  let authUser: AuthUser | null = null;
  try {
    const { data: createData, error: createAuthUserError } =
      await adminSupabaseClient.auth.admin.createUser({
        phone: phoneNumber,
        password: Math.random().toString(36).slice(-10),
        phone_confirm: true,
      });
    if (createAuthUserError) {
      if (
        isAuthError(createAuthUserError) &&
        (createAuthUserError.code === "phone_exists" ||
          createAuthUserError.message
            .toLowerCase()
            .includes("phone number already registered"))
      ) {
        console.warn(
          `createUserWithProfileAndAdmin: Phone ${phoneNumber} already registered. Fetching existing.`
        );
        authUser = await findAuthUserByPhoneWithAdmin(phoneNumber);
        if (!authUser)
          throw new Error(
            `Phone exists (per createUser) but could not fetch user: ${phoneNumber}`
          );
        console.log(
          `createUserWithProfileAndAdmin: Fetched existing auth user: ${authUser.id}`
        );
      } else throw createAuthUserError;
    } else if (createData?.user) {
      authUser = createData.user;
      console.log(
        `createUserWithProfileAndAdmin: Auth user created: ${authUser.id}`
      );
    } else
      throw new Error(
        "Auth user creation failed: no user object and no specific error."
      );

    if (!authUser) throw new Error("Auth user could not be established.");

    const userProfileData: UserInsertInput = {
      id: authUser.id,
      email:
        authUser.email ||
        `${phoneNumber.replace(/[^\d]/g, "")}@phonemail.example.com`,
      tenant_id: tenantId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    };
    const validatedProfileData = usersInsertSchema.parse(userProfileData);
    const { data: upsertedProfile, error: profileUpsertError } =
      await adminSupabaseClient
        .from("users")
        .upsert(validatedProfileData, { onConflict: "id" })
        .select()
        .single();
    if (profileUpsertError) throw profileUpsertError;
    if (!upsertedProfile) throw new Error("Failed to upsert user profile.");

    console.log(
      `createUserWithProfileAndAdmin: Profile upserted: ${
        (upsertedProfile as UserRow).id
      }`
    );
    return usersRowSchema.parse(upsertedProfile);
  } catch (e: any) {
    console.error(
      `createUserWithProfileAndAdmin Error: ${e.message}`,
      isAuthError(e) ? { s: e.status, c: e.code } : e
    );
    return null;
  }
}
