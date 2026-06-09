<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Ingrediente;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductoController extends Controller
{
    public function index(Request $request): Response
    {

        // Columnas por las que se permite ordenar (whitelist de seguridad)
        // Si el usuario manipula la URL con una columna no permitida,
        // usamos 'nombre' por defecto.
        $allowed = ['nombre', 'tipo', 'precio', 'es_recomendado'];
        $sort = in_array($request->sort, $allowed) ? $request->sort : 'nombre';
        $dir  = $request->dir === 'asc' ? 'asc' : 'desc';
    
        $productos = Producto::with('ingredientes')
            ->orderBy($sort, $dir)
            ->paginate(10)
            ->appends($request->only('sort', 'dir'));  // mantiene los parámetros de ordenación en los links de paginación
    
        return Inertia::render('Productos/Index', [
            'productos' => $productos,
            'sort'      => $sort,
            'dir'       => $dir,
        ]);
    }
    public function show(Producto $producto): Response
    {

    // Cargamos los ingredientes relacionados (lazy load aquí porque
    // solo se usa en el detalle, no en el listado)
    $producto->load('ingredientes');

    return Inertia::render('Productos/Show', [
        'producto' => $producto,
    ]);
    }

    public function create(): Response
    {
        $ingredientes = Ingrediente::orderBy('nombre')->get();

        return Inertia::render('Productos/Create', [
            'ingredientes'      => $ingredientes,
            // lista fija de 14 alérgenos
            'alergenosOpciones' => self::alergenosOpciones(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {

        // validate() comprueba que los datos cumplen las reglas.
        // Si alguna falla, Laravel redirige automáticamente al formulario
        // con los errores. Si todas pasan, devuelve los datos validados.
        $data = $request->validate([
            'tipo'           => 'required|in:plato,bebida',
            'nombre'         => 'required|string|max:40',
            'descripcion'    => 'nullable|string',
            'precio'         => 'required|numeric|min:0',
            'url_imagen'     => 'nullable|url|max:150',
            'es_recomendado' => 'boolean',
            'alergeno'       => 'nullable|array',
            'alergeno.*'     => 'string|in:' . implode(',', array_column(self::alergenosOpciones(), 'id')), // alergeno.* valida CADA elemento del array contra la lista de IDs permitidos
            'ingredientes'   => 'nullable|array',
            'ingredientes.*' => 'integer|exists:ingredientes,id',
        ]);

        // Creamos el producto con los datos validados
        $producto = Producto::create($data);

        // sync() gestiona la relación many-to-many con ingredientes.
        // Añade los nuevos, quita los que ya no están, no toca los que siguen.
        if (!empty($data['ingredientes'])) {
            $producto->ingredientes()->sync($data['ingredientes']);
        }

        // Redirigimos al listado con mensaje de éxito
        // with() guarda el mensaje en la sesión flash (desaparece tras mostrarse)
        return redirect()->route('productos.index')
            ->with('success', 'Producto creado correctamente.');
    }

    public function edit(Producto $producto): Response
    {
        $ingredientes = Ingrediente::orderBy('nombre')->get();

        return Inertia::render('Productos/Edit', [
            // load('ingredientes') carga los ingredientes del producto actual
            // para poder marcar cuáles ya tiene en el formulario
            'producto'          => $producto->load('ingredientes'),
            'ingredientes'      => $ingredientes,
            'alergenosOpciones' => self::alergenosOpciones(),
        ]);
    }

    public function update(Request $request, Producto $producto): RedirectResponse
    {
        // Mismas reglas de validación que store()
        $data = $request->validate([
            'tipo'           => 'required|in:plato,bebida',
            'nombre'         => 'required|string|max:40',
            'descripcion'    => 'nullable|string',
            'precio'         => 'required|numeric|min:0',
            'url_imagen'     => 'nullable|url|max:150',
            'es_recomendado' => 'boolean',
            'alergeno'       => 'nullable|array',
            'alergeno.*'     => 'string|in:' . implode(',', array_column(self::alergenosOpciones(), 'id')),
            'ingredientes'   => 'nullable|array',
            'ingredientes.*' => 'integer|exists:ingredientes,id',
        ]);

        // Actualiza solo los campos que han cambiado
        $producto->update($data);

        // sync() también elimina ingredientes que se hayan desmarcado en el formulario.
        // ?? [] por si viene null (sin ingredientes seleccionados)
        $producto->ingredientes()->sync($data['ingredientes'] ?? []);

        return redirect()->route('productos.index')
            ->with('success', 'Producto actualizado correctamente.');
    }

    public function destroy(Producto $producto): RedirectResponse
    {
        $producto->delete();

        return redirect()->route('productos.index')
            ->with('success', 'Producto eliminado correctamente.');
    }

    /**
     * Lista de los 14 alérgenos obligatorios según el Reglamento UE 1169/2011.
     * Es un método estático porque no necesita instanciar el controlador
     * y se reutiliza en create(), edit() y en las validaciones de store()/update().
     *
     * Static = podemos llamarlo como self::alergenosOpciones() desde cualquier
     * método de esta clase sin crear un objeto new ProductoController().
     */
    public static function alergenosOpciones(): array
    {
        return [
            ['id' => 'gluten',       'nombre' => 'Gluten'],
            ['id' => 'lacteos',      'nombre' => 'Lácteos'],
            ['id' => 'huevo',        'nombre' => 'Huevo'],
            ['id' => 'pescado',      'nombre' => 'Pescado'],
            ['id' => 'marisco',      'nombre' => 'Marisco'],
            ['id' => 'frutos_secos', 'nombre' => 'Frutos secos'],
            ['id' => 'soja',         'nombre' => 'Soja'],
            ['id' => 'apio',         'nombre' => 'Apio'],
            ['id' => 'mostaza',      'nombre' => 'Mostaza'],
            ['id' => 'sesamo',       'nombre' => 'Sésamo'],
            ['id' => 'sulfitos',     'nombre' => 'Sulfitos'],
            ['id' => 'moluscos',     'nombre' => 'Moluscos'],
            ['id' => 'altramuces',   'nombre' => 'Altramuces'],
            ['id' => 'cacahuetes',   'nombre' => 'Cacahuetes'],
        ];
    }
}