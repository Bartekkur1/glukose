<?php

namespace App\Tests\Controller;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use PHPUnit\Framework\TestCase;

/**
 * execute order 66 => ./vendor/bin/phpunit
 */
class UserTest extends WebTestCase
{
    private $user;

    public function setUp() : void
    {
        $this->user = new User();
        $this->user->setUsername("TestUser123");
        $this->user->setPassword("Password123");
        $this->user->setEmail("Testuser123@test.com");
    }

    public function testRegisterUserSuccessful()
    {
        $data = [
            "username" => $this->user->getUsername(),
            "password" => $this->user->getPassword(),
            "confirmPassword" => $this->user->getPassword(),
            "email" => $this->user->getEmail(),
        ];
        $response = $this->newAccountFunc($data);
        $this->assertGreaterThan(0, strlen($response->getContent()));
        $this->assertSame(Response::HTTP_OK, $response->getStatusCode());
    }

    public function testRegisterBadUsername()
    {
        $this->user->setUsername("byku");
        $data = [
            "username" => $this->user->getUsername(),
            "password" => $this->user->getPassword(),
            "confirmPassword" => $this->user->getPassword(),
            "email" => $this->user->getEmail(),
        ];
        $response = $this->newAccountFunc($data);
        $this->assertSame(Response::HTTP_BAD_REQUEST, $response->getStatusCode());
        $responseData = json_decode($response->getContent(), true);
        $this->assertSame($responseData["error"], "Login musi mieć przynajmniej 5 znaków");
    }

    public function testRegisterBadEmail()
    {
        $this->user->setEmail("badEmail.com");
        $data = [
            "username" => $this->user->getUsername(),
            "password" => $this->user->getPassword(),
            "confirmPassword" => $this->user->getPassword(),
            "email" => $this->user->getEmail(),
        ];
        $response = $this->newAccountFunc($data);
        $this->assertSame(Response::HTTP_BAD_REQUEST, $response->getStatusCode());
        $responseData = json_decode($response->getContent(), true);
        $this->assertSame($responseData["error"], "Podany email nie jest poprawny");
    }

    // public function testUserDelete()
    // {
    //     $response = $this->deleteAccount();
    //     $this->assertSame("", $response->getContent());
    //     $this->assertSame(Response::HTTP_OK, $response->getStatusCode());
    // }

    private function deleteAccount()
    {
        $client = static::createClient();
        $client->request('POST', '/user/deletemyaccount', [], [],
        ["HTTP_user" => $this->user->serialize()]);
        return $client->getResponse();
    }

    private function newAccountFunc($data)
    {
        $client = static::createClient();
        $client->request(
            'POST', '/user/register', array(), array(), ['CONTENT_TYPE' => 'application/json'],
            json_encode($data)
        );
        return $client->getResponse();
    }
}