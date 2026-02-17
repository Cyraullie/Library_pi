"use client";

interface BookCardProps {
  title: string;
  isbn:string;
  author: string;
  image: string;
  tome?: number;
  read?: boolean;
  rate?: number;
  add?: number;
  //onClick?: () => void;
}

export default function BookCard({
  title,
  isbn,
  author,
  image,
  tome,
  read,
  rate,
  add,
  //onClick,
}: BookCardProps) {
  return (
    <div
      //onClick={onClick}
      className="bg-gray-800 shadow rounded-xl overflow-hidden hover:shadow-lg transition w-full h-[350px] flex flex-col"
	  style={{ width: "250px", height: "400px"}}
    >
      {/* Image fixe en hauteur */}
      <div className="h-55 overflow-hidden" style={{margin: "auto", marginTop: "15px", borderRadius: "5px"}}>
        <img
          src={image}
          alt={title}
          className="h-full"
        />
      </div>

      {/* Contenu texte */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="overflow-auto">
          <h2 className="font-bold text-lg">{title}</h2>
          <p className="text-sm text-gray-600">{author}</p>
          {tome && <p className="text-xs text-gray-500">Tome {tome}</p>}
        </div>

        <div className="mt-2">
          {read !== undefined && (
            <p
              className={`text-xs font-bold ${
                read ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {read ? "Lu ✅" : "À lire 📖"}
            </p>
          )}
          {rate !== undefined && <p className="text-xs">⭐ {rate}/5</p>}
        </div>
      </div>
	  {add !== undefined && (
		<button
			className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
			onClick={async () => {
				const token = localStorage.getItem("token");
				if (!token) return alert("Vous devez être connecté");

				const res = await fetch("/api/me/books", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ isbn: isbn }),
				});

				const data = await res.json();
				alert(data.message);
			}}
			>
			Ajouter
			</button>
	  )}
	  

    </div>
  );
}
