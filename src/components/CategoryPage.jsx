import React from "react";
import { useParams } from "react-router-dom";
import categories from "./DataCategory";

export default function CategoryPage () {
  const { slug } = useParams ();

  const category = categories.find((category) => category.slug === slug);
  const categoryName = category ? category.name : "Ukjent kategori";

  return (
    <div>
      <h1>{categoryName}</h1>
    </div>
  );
}

