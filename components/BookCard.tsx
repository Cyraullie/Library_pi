"use client";

interface BookCardProps {
  title: string;
  author: string;
  image: string;
  tome?: number;
  read?: boolean;
  rate?: number;
  onClick?: () => void;
}

export default function BookCard({
  title,
  author,
  image,
  tome,
  read,
  rate,
  onClick,
}: BookCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white shadow rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition w-full h-[350px] flex flex-col"
    >
      {/* Image fixe en hauteur */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
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
    </div>
  );
}
