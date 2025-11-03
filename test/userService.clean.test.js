const { UserService } = require ('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes com Smells', () => {
  let userService;

  // O setup é executado antes de cada teste
  beforeEach(() => {
    userService = new UserService();
    userService._clearDB(); // Limpa o "banco" para cada teste
  });

  test('deve criar um novo usuário com sucesso', () => {
  
    const { nome, email, idade } = dadosUsuarioPadrao;

    const usuarioCriado = userService.createUser(nome, email, idade);

    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioCriado.nome).toBe(nome);
    expect(usuarioCriado.email).toBe(email);
    expect(usuarioCriado.idade).toBe(idade);
    expect(usuarioCriado.status).toBe('ativo'); 
  });

  test('deve buscar um usuário existente pelo ID', () => {

    const usuarioExistente = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    const usuarioBuscado = userService.getUserById(usuarioExistente.id);

    expect(usuarioBuscado).toBeDefined();
    expect(usuarioBuscado.id).toBe(usuarioExistente.id);
    expect(usuarioBuscado.nome).toBe(usuarioExistente.nome);
  });

  test('deve desativar um usuário comum com sucesso', () => {

    const usuarioComum = userService.createUser('user comum', 'comum@teste.com', 20, false);

    const resultado = userService.deactivateUser(usuarioComum.id);

    const usuarioAtualizado = userService.getUserById(usuarioComum.id);
  
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('Não deve desativar um usuário administrador', () => {
  
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    const resultado = userService.deactivateUser(usuarioAdmin.id);

    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);
  
    expect(resultado).toBe(false);
    expect(usuarioAtualizado.status).toBe('ativo'); 
  });

  test('deve gerar um relatório contendo os dados essenciais dos usuários', () => {

    const usuario1 = userService.createUser('Sophia', 'Sophia@email.com', 28);
    const usuario2 = userService.createUser('Ze', 'Ze@email.com', 32);

    const relatorio = userService.generateUserReport();

    expect(relatorio).toContain('--- Relatório de Usuários ---');
    
    expect(relatorio).toContain(usuario1.id);
    expect(relatorio).toContain('Sophia');
    
    expect(relatorio).toContain(usuario2.id);
    expect(relatorio).toContain('Ze');

    expect(relatorio).toContain('ativo');
  });
  
  test('deve falhar ao criar usuário menor de idade', () => {

  const nome = 'Ana Menor de idade';
  const email = 'anamenor@email.com';
  const idadeMenorDeIdade = 17;

  const CreateUserMenor = () => {
    userService.createUser(nome, email, idadeMenorDeIdade);
  };
  expect(CreateUserMenor).toThrow('O usuário deve ser maior de idade.');
  });

  test('deve gerar um relatório vazio quando não há usuários', () => {

    const relatorio = userService.generateUserReport();

    expect(relatorio).toContain('--- Relatório de Usuários ---');
    
    expect(relatorio).not.toContain('ID:');
    expect(relatorio).not.toContain('Nome:');
  });
});