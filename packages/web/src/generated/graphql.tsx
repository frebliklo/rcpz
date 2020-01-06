import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any,
};

export type AuthResponse = {
   __typename?: 'AuthResponse',
  accessToken: Scalars['String'],
  user: User,
};

export type CreateRecipeInput = {
  title: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  published?: Maybe<Scalars['Boolean']>,
  ingredients: Array<IngredientInput>,
};

/** Sort by creation or update time */
export enum DateOrderBy {
  CreatedAsc = 'CREATED_ASC',
  CreatedDesc = 'CREATED_DESC',
  UpdatedAsc = 'UPDATED_ASC',
  UpdatedDesc = 'UPDATED_DESC'
}


export type Ingredient = {
   __typename?: 'Ingredient',
  id: Scalars['ID'],
  title: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  photo?: Maybe<Scalars['String']>,
  amount?: Maybe<Scalars['Int']>,
  measurement?: Maybe<Measurement>,
  recipe: Recipe,
};

export type IngredientInput = {
  title: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  amount?: Maybe<Scalars['Int']>,
  measurement?: Maybe<Measurement>,
};

/** Type of measurement for the ingredient */
export enum Measurement {
  Pinch = 'PINCH',
  Teaspoon = 'TEASPOON',
  Tablespoon = 'TABLESPOON',
  Ml = 'ML',
  Cl = 'CL',
  Dl = 'DL',
  L = 'L',
  G = 'G',
  Kg = 'KG',
  Cup = 'CUP'
}

export type Mutation = {
   __typename?: 'Mutation',
  signInWithEmail: AuthResponse,
  logout: Scalars['Boolean'],
  registerWithEmail: AuthResponse,
  /** Author a new recipe for the currently authenticated user */
  createRecipe: Recipe,
  updateRecipe: Recipe,
  deleteRecipe: Scalars['Boolean'],
  updateUser: User,
  deleteUser: Scalars['Boolean'],
  /** Add a todo to the currently authenticated user */
  addTodo: TodoItem,
  /** Toggle the completed status of a todo by id */
  toggleTodo: TodoItem,
};


export type MutationSignInWithEmailArgs = {
  data: SignInInput
};


export type MutationRegisterWithEmailArgs = {
  data: RegisterInput
};


export type MutationCreateRecipeArgs = {
  data: CreateRecipeInput
};


export type MutationUpdateRecipeArgs = {
  data: UpdateRecipeInput,
  id: Scalars['String']
};


export type MutationDeleteRecipeArgs = {
  id: Scalars['String']
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput
};


export type MutationAddTodoArgs = {
  title: Scalars['String']
};


export type MutationToggleTodoArgs = {
  id: Scalars['String']
};

export type Query = {
   __typename?: 'Query',
  /** Find published recipes */
  recipes: Array<Recipe>,
  /** Find the currently authenticated users recipes */
  myRecipes: Array<Recipe>,
  /** Find the currently authenticated user */
  me: User,
  /** Find a user by id */
  user: User,
  users: Array<User>,
  /** Get the list for the currently authenticated user */
  myTodos: Array<TodoItem>,
};


export type QueryRecipesArgs = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  query?: Maybe<Scalars['String']>
};


export type QueryUserArgs = {
  id: Scalars['String']
};


export type QueryUsersArgs = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  query?: Maybe<Scalars['String']>
};


export type QueryMyTodosArgs = {
  skip?: Maybe<Scalars['Int']>,
  take?: Maybe<Scalars['Int']>,
  orderByDate?: Maybe<DateOrderBy>,
  orderByCompleted?: Maybe<Scalars['Boolean']>
};

export type Recipe = {
   __typename?: 'Recipe',
  id: Scalars['ID'],
  title: Scalars['String'],
  description?: Maybe<Scalars['String']>,
  photo?: Maybe<Scalars['String']>,
  published: Scalars['Boolean'],
  author: User,
  ingredients: Array<Ingredient>,
};

export type RegisterInput = {
  email: Scalars['String'],
  password: Scalars['String'],
  firstName: Scalars['String'],
  lastName?: Maybe<Scalars['String']>,
  role?: Maybe<UserRole>,
};

export type SignInInput = {
  email: Scalars['String'],
  password: Scalars['String'],
};

export type TodoItem = {
   __typename?: 'TodoItem',
  id: Scalars['ID'],
  completed: Scalars['Boolean'],
  createdAt: Scalars['DateTime'],
  updatedAt: Scalars['DateTime'],
  title: Scalars['String'],
  owner: User,
};

export type UpdateRecipeInput = {
  title?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  published?: Maybe<Scalars['Boolean']>,
  ingredients: Array<IngredientInput>,
  removeIngredients?: Maybe<Array<Scalars['String']>>,
};

export type UpdateUserInput = {
  firstName?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>,
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  role: UserRole,
  firstName: Scalars['String'],
  lastName?: Maybe<Scalars['String']>,
  fullName: Scalars['String'],
  email?: Maybe<Scalars['String']>,
  emailVerified?: Maybe<Scalars['Boolean']>,
  /** Get the refresh token version for the currently authenticated user */
  tokenVersion?: Maybe<Scalars['Int']>,
  recipes: Array<Recipe>,
  todos: Array<TodoItem>,
};

/** Possible roles for a user */
export enum UserRole {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  Viewer = 'VIEWER'
}

export type LogoutMutationVariables = {};


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type MeQueryVariables = {};


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'firstName' | 'lastName'>
    & { todos: Array<(
      { __typename?: 'TodoItem' }
      & Pick<TodoItem, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'completed'>
    )>, recipes: Array<(
      { __typename?: 'Recipe' }
      & Pick<Recipe, 'id' | 'title'>
    )> }
  ) }
);

export type SignUpMutationVariables = {
  input: RegisterInput
};


export type SignUpMutation = (
  { __typename?: 'Mutation' }
  & { registerWithEmail: (
    { __typename?: 'AuthResponse' }
    & Pick<AuthResponse, 'accessToken'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName'>
    ) }
  ) }
);

export type SignInMutationVariables = {
  input: SignInInput
};


export type SignInMutation = (
  { __typename?: 'Mutation' }
  & { signInWithEmail: (
    { __typename?: 'AuthResponse' }
    & Pick<AuthResponse, 'accessToken'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'firstName'>
    ) }
  ) }
);


export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    firstName
    lastName
    todos {
      id
      createdAt
      updatedAt
      title
      completed
    }
    recipes {
      id
      title
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<MeQuery, MeQueryVariables>;
export const SignUpDocument = gql`
    mutation SignUp($input: RegisterInput!) {
  registerWithEmail(data: $input) {
    accessToken
    user {
      id
      firstName
    }
  }
}
    `;
export type SignUpMutationFn = ApolloReactCommon.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        return ApolloReactHooks.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, baseOptions);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = ApolloReactCommon.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = ApolloReactCommon.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const SignInDocument = gql`
    mutation SignIn($input: SignInInput!) {
  signInWithEmail(data: $input) {
    accessToken
    user {
      id
      firstName
    }
  }
}
    `;
export type SignInMutationFn = ApolloReactCommon.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        return ApolloReactHooks.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, baseOptions);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = ApolloReactCommon.MutationResult<SignInMutation>;
export type SignInMutationOptions = ApolloReactCommon.BaseMutationOptions<SignInMutation, SignInMutationVariables>;