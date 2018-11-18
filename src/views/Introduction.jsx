import React from "react";
import { NavLink } from "react-router-dom";

const LoginLink = () => <NavLink to="/login">Login</NavLink>;

export default function Introduction() {
  return <LoginLink />;
}
