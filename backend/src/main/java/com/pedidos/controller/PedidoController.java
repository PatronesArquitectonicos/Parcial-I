package com.pedidos.controller;

import com.pedidos.model.Pedido;
import com.pedidos.repository.PedidoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoRepository pedidoRepository;

    public PedidoController(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    @GetMapping
    public List<Pedido> listarPedidos() {
        return pedidoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPedido(@PathVariable Long id) {
        return pedidoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody Pedido pedido) {
        Pedido nuevo = pedidoRepository.save(pedido);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pedido> actualizarPedido(@PathVariable Long id, @RequestBody Pedido pedido) {
        return pedidoRepository.findById(id)
                .map(existente -> {
                    existente.setCliente(pedido.getCliente());
                    existente.setProducto(pedido.getProducto());
                    existente.setCantidad(pedido.getCantidad());
                    existente.setPrecioTotal(pedido.getPrecioTotal());
                    existente.setEstado(pedido.getEstado());
                    return ResponseEntity.ok(pedidoRepository.save(existente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Long id) {
        if (pedidoRepository.existsById(id)) {
            pedidoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}
