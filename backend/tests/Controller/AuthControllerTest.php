<?php

namespace App\Tests\Controller;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use PHPUnit\Framework\TestCase;
use \Firebase\JWT\JWT;

/**
 * execute order 66 => ./vendor/bin/phpunit
 */
class AuthTest extends WebTestCase
{
    private $user;

    public function setUp() : void
    {
        $this->user = new User();
        $this->user->setUsername("TestUser123");
        $this->user->setPassword("Password123");
    }

    public function testUserAuth()
    {
        $client = static::createClient();

        $data = [
            "username" => $this->user->getUsername(),
            "password" => $this->user->getPassword(),
        ];
        $client->request(
            'POST', '/auth/login', array(), array(), ['CONTENT_TYPE' => 'application/json'],
            json_encode($data)
        );
        $response = $client->getResponse();
        $responseData = json_decode($response->getContent(), true);

        // make sure token was generated
        $this->assertSame(Response::HTTP_OK, $response->getStatusCode());
        $this->assertGreaterThan(0, strlen($response->getContent()));

        // token check
        $decoded = JWT::decode($responseData["token"], $_ENV["JWT_KEY"], array('HS256'));
        $this->user->unserialize($decoded->user);
        $this->assertSame("TestUser123", $this->user->getUsername());
        $this->assertSame("Testuser123@test.com", $this->user->getEmail());
    }
}