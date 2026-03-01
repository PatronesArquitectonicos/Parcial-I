# mdjva!/usr/bin/env python3
import os
from pathlib import Path

IGNORED_DEFAULT = {
    ".git",
    ".mypy_cache",
    ".ruff_cache",
    "__pycache__",
    ".venv",
    "estructura_repo.txt",
    "generar_estructura.py",
    "node_modules",
}

MIGRATIONS_DIR_NAME = "migrations"


def load_ignore_patterns():
    patterns = set(IGNORED_DEFAULT)

    for filename in [".gitignore", ".dockerignore"]:
        if Path(filename).exists():
            with open(filename, "r") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#"):
                        patterns.add(line.rstrip("/"))

    return patterns


def should_ignore(name, patterns):
    for p in patterns:
        if name == p or name.startswith(p):
            return True
    return False


def build_tree(directory, prefix="", ignore_patterns=None):
    entries = sorted(os.listdir(directory))
    tree_lines = []
    entries = [e for e in entries if not should_ignore(e, ignore_patterns)]

    for i, entry in enumerate(entries):
        path = os.path.join(directory, entry)
        connector = "└── " if i == len(entries) - 1 else "├── "

        tree_lines.append(prefix + connector + entry)

        # Caso especial: migrations → mostrar carpeta pero NO entrar
        if entry == MIGRATIONS_DIR_NAME and os.path.isdir(path):
            continue

        if os.path.isdir(path):
            extension = "    " if i == len(entries) - 1 else "│   "
            tree_lines.extend(build_tree(path, prefix + extension, ignore_patterns))

    return tree_lines


def main():
    root = Path(".").resolve()
    ignore_patterns = load_ignore_patterns()

    tree = [root.name + "/"]
    tree.extend(build_tree(root, ignore_patterns=ignore_patterns))

    output_file = root / "estructura_repo.txt"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(tree))

    print(f"Estructura generada en: {output_file}")


if __name__ == "__main__":
    main()
