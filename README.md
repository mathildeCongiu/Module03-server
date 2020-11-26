# VOLUNT'HERO

### DESCRIPTION

With VOLUNT'HERO, charity associations may contact with volunteers shops that want to give their leftovers to be redistributed to needy people. 

### USER STORIES

- **404** - As an Association or Business User I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault.
- **500** - As an Association or Business User I want to see a nice error page when the super team screws it up so that I know that is not my fault.
- **Sign up** - As a Association or Business User I want to sign up on the webpage so that I can see all the tasks that I could do to be more eco-friendly.
- **Login** - As a Association or Business User I want to be able to log in on the webpage so that I can get back to my account
- **Logout** - As an Association or Business User I want to be able to log out from the webpage so that I can make sure no one will access my account
- **About Us** - As an Association or Business User I want to know more about the incredible creators of this amazing initiative. :p ahah so that I can start registering my association or Business.
- **FAQ** - As an Association or Business User I want to know how to use the app so that I can start registering my association or Business.

As an Association User I want to... 

- **Dashboard - Collaborations** - have a list of my collaborations with Businesses so that I can access the pickup profile and access my own profile.
- **Dashboard - Pending** - see the pending answer collaborations so that I don't ask it twice. 
- **Search** - find the registered Businesses who want to give their leftovers or find them through a filter so that I can find the perfect match.
- **Request page** - see details of a specific Business and ask collaboration so that I can pick-up the leftovers a specific day and hour.
- **Others** - see more options in my page so that I can log out or see about the app.

As an Business User I want to... 

- **Dashboard - Collaborations** - have a list of my collaborations with Associations so that I can access the pickup profile and access my own profile.
- **Dashboard - Pending** - see the pending request collaborations so that I can accept or reject a new request from an association.
- **Association Details** - see the details of the associations which want to collaborate with us so that I can see their descriptions.
- **Product list** - see all the leftovers I have to give so that associations can access to these products. 
- **New Product** - add and edit the products I have to give so that the product list is always updated.
- **Edit / Delete Product** - delete the products I have to give so that the product list is always updated.

### BACKLOG

- **Edit user** - As a User I want to be able to edit my profile so that I can update my data.
- **Map** - As an Association I want to to see a map with the Businesses that are around us.
- **Chat** - As an Association or Business User I want to chat with the other part so that I can speak the last details. (schedule modification, problem...)

## **CLIENT / FRONTEND**

### REACT ROUTER ROUTES (React App):

| **Path**                   | **Component**  | Permissions              | Behavior                                                     |
| -------------------------- | -------------- | ------------------------ | ------------------------------------------------------------ |
| `/`                        | Home           | anon only `AnonRoute`    | Home page.                                                   |
| `/signup`                  | Signup         | anon only `AnonRoute`    | Sign up form for Businesses and Associations.                |
| `/login`                   | Login          | anon only `AnonRoute`    | Log in form for Businesses and Asociations.                  |
| `/dashboard`               | Dashboard      | user only `PrivateRoute` | Shows the partnerships and the pending partnerships that a Business or Association has. |
| `/products`                | ProductsPage   | user only `PrivateRoute` | Shows the products that an own Business has.                 |
| `/products/add`            | AddProduct     | user only `PrivateRoute` | Shows the form for adding a new product.                     |
| `/products/edit/:id`       | EditProduct    | user only `PrivateRoute` | Shows the form to update an specific product.                |
| `/others`                  | Others         | user only `PrivateRoute` | Shows a page with other information such as edit profile or delete account or log out. |
| `/business-details/:id`    | BusinessDetail | user only `PrivateRoute` | Shows the details of a specific Business                     |
| `/assiciation-details/:id` | AssoDetails    | user only `PrivateRoute` | Shows the details of a specific Association                  |

### COMPONENTS

- AnonRoute
- PrivateRoute
- Card
- CardList
- Navbar
- ProductCard
- ProductsList
- ProfileHeader
- AssoLogin
- AssoSignup
- BusinessLogin
- BusinessSignup
- HomeSignUpCard

### SERVICES

- Auth Service

  - auth.login(user)
- auth.signup(user)
  - auth.logout()
- auth.me()
  - auth.delete()

- Business Service

  - BusinessFunc.addNewProduct(name, typeName)
  - BusinessFunc.editProduct(name, typeName, id)
  - BusinessFunc.deleteProduct(id)
  - BusinessFunc.accept(id)
  - BusinessFunc.reject(id)

- Association Service

  - AssoFunc.searchBusinesses()

  - AssoFunc.postRequest(id)

  - AssoFunc.getBusiness(id)

    

## SERVER / BACKEND

### MODELS

AssoUser model

```
{
  relationship: { type: String, default: "association" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    logo: String,
    address: {
      street: { type: String, required: true },
      number: { type: Number, required: true },
      flat: { type: String },
      city: { type: String, required: true },
      postcode: { type: Number, required: true },
      country: { type: String, required: true },
    },
    phoneNumber: { type: Number },
    description: String,
    partnerships: [{ type: Schema.Types.ObjectId, ref: "BusinessUser" }],
    pendingPartnerships: [{ type: Schema.Types.ObjectId, ref: "BusinessUser" }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
}
```

BusinessUser model

```
relationship: { type: String, default: "business" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    logo: String,
    address: {
      street: { type: String, required: true },
      number: { type: Number, required: true },
      flat: { type: String },
      city: { type: String, required: true },
      postcode: { type: Number, required: true },
      country: { type: String, required: true },
    },
    phoneNumber: { type: Number },
    description: String,
    partnerships: [{ type: Schema.Types.ObjectId, ref: "AssoUser" }],
    pendingPartnerships: [{ type: Schema.Types.ObjectId, ref: "AssoUser" }],
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    type: {
      name: { type: String, required: true},
      img: { type: String },
    },
    pickup: {
      day: { type: String },
      // hour: { type:  }
      place: { type: String },
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
```

Product model

```
{
  name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "BusinessUser" },
    productType: {
      name: { type: String, required: true },
      img: String,
    },
    today: {
      isAvailable: Boolean,
      quantity: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
}
```

### API ENDPOINT (BACKEND ROUTES)

| **Method** | **Route**                              | **Description**                                              | Request - Body                                               |
| ---------- | -------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `POST`     | `/auth/signup/business`                | Sends Sign up Business form data to the server.              | { name, email, password, logo, street, number, flat, city, postcode, country, phoneNumber, description, typeName, pickupDate, pickupPlace } |
| `POST`     | `/auth/login/business`                 | Sends Log in Business form data to the server.               | { email, password }                                          |
| `POST`     | `/auth/signup/association`             | Sends Sign up Association form data to the server.           | { name, email, password, logo, street, number, flat, city, postcode, country, phoneNumber, description } |
| `POST`     | `/auth/login/association`              | Sends Log in Association form data to the server.            | { email, password }                                          |
| `POST`     | `/auth/logout`                         | Private route. Logs user out of the page.                    |                                                              |
| `GET`      | `/auth/me`                             | Private route. Check if the user is logged in.               |                                                              |
| `DELETE`   | `/delete-user`                         | Private route. Delete user from the server.                  |                                                              |
| `PUT`      | `/business/edit`                       | Private route. Sends Business user data to update the profile. | { name, email, password, logo, street, number, flat, city, postcode, country, phoneNumber, description, typeName, pickupDate, pickupPlace } |
| `POST`     | `/business/products/new`               | Private route. Sends information and creates a new product to the server. | { name, typeName }                                           |
| `PUT`      | `/business/products/edit/:id`          | Private route. Sends information and creates a new product to the server. | { name, typeName }                                           |
| `DELETE`   | `/business/products/:id`               | Private route. Delete product from the server.               |                                                              |
| `GET`      | `/business/association/:assoId`        | Private route. Show an Association details.                  |                                                              |
| `POST`     | `/business/association/accept/:assoId` | Private route. Push the Association ID to the Business user partnerships array and push the Business ID to the Association user partnerships array. |                                                              |
| `POST`     | `/business/association/reject/:assoId` | Private route. Pull the Association ID from the Business user pendingPartnerships array. |                                                              |
| `POST`     | `/association/edit`                    | Private route. Sends Association user data to update the profile. | { name, email, password, logo, street, number, flat, city, postcode, country, phoneNumber, description } |
| `GET`      | `/association/search`                  | Private route. Show list of associations.                    |                                                              |
| `POST`     | `/association/business/:businessId`    | Private route. Push the Business ID to the Association user pendingPartnerships array and push the Association ID to the Business user pendingPartnerships array. |                                                              |



## LINKS

### Trello

[Trello Board](https://trello.com/b/4VGGa1x0/m3-project)

### Git

[GitHub Server](https://github.com/mathildeCongiu/Module03-server)

[GitHub Client](https://github.com/mathildeCongiu/Module03-client)

[Deploy Link](https://volunthero.herokuapp.com)

### Presentation

[Presentation link](https://docs.google.com/presentation/d/15CJ9MPlJ7WSHtP3eK7gdCWQYtT2gJbQnGAkpZOG9f6c/edit?usp=sharing)