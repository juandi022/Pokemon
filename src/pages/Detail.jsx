import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { usePokemonService } from "../context/Context";

const STAT_META = {
  hp:                { label: "HP"    },
  attack:            { label: "ATK"   },
  defense:           { label: "DEF"   },
  "special-attack":  { label: "S.ATK" },
  "special-defense": { label: "S.DEF" },
  speed:             { label: "SPD"   },
};

   const headerTypeColor = {
      normal: 'bg-stone-500',
      fire: 'bg-orange-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-500',
      grass: 'bg-green-600',
      ice: 'bg-cyan-400',
      fighting: 'bg-red-700',
      poison: 'bg-violet-600',
      ground: 'bg-amber-600',
      flying: 'bg-sky-500',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-600',
      rock: 'bg-yellow-700',
      ghost: 'bg-indigo-700',
      dragon: 'bg-indigo-500',
      dark: 'bg-neutral-800',
      steel: 'bg-slate-500',
      fairy: 'bg-rose-400'
    };

export const Detail = () => {
  const { id } = useParams();
  const pokemon = usePokemonService().GetPokemonById(id);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!pokemon) return;
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
      .then(res => res.json())
      .then(data => {
        const entry = data.flavor_text_entries.find(e => e.language.name === "es")
          ?? data.flavor_text_entries.find(e => e.language.name === "en");
        if (entry) {
          setDescription(entry.flavor_text.replace(/\f|\n/g, " "));
        }
      })
      .catch(() => {});
  }, [pokemon]);

  if (!pokemon) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Pokémon #{id} no encontrado.</p>
    </div>
  );

  const img =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-xs overflow-hidden">

        {/* Header con foto */}
      <div className={`${headerTypeColor[pokemon.types?.[0]?.type?.name] ?? 'bg-gray-200'} flex flex-col items-center pt-6 pb-4 px-4`}>
  <img src={img} alt={pokemon.name} className="w-32 h-32 object-contain" />
  <p className="text-xs text-white/70 font-mono mt-1">
    #{String(pokemon.id).padStart(3, "0")}
  </p>
  <h1 className="text-xl font-semibold capitalize text-white">
    {pokemon.name}
  </h1>
</div>

        {/* Descripción */}
        {description && (
          <div className="px-5 pt-4">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-1">
              Descripción
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="px-5 py-4 flex flex-col gap-2.5">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
            Base Stats
          </p>
          {(pokemon.stats ?? []).map(({ stat, base_stat }) => {
            const meta = STAT_META[stat.name] ?? { label: stat.name };
            const pct = Math.min(Math.round((base_stat / 255) * 100), 100);
            return (
              <div key={stat.name} className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-gray-400 w-10 text-right shrink-0">
                  {meta.label}
                </span>
                <span className="text-[13px] font-semibold text-gray-700 w-7 shrink-0">
                  {base_stat}
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gray-400" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Detail;