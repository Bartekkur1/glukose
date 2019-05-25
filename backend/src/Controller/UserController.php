<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use App\Service\UserService;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserController extends AbstractController
{

    private $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * @Route("/user/update", name="user_update")
     */
    public function update(Request $request)
    {
        $user = $this->getUser();
        $input = json_decode($request->getContent(), true);
        try 
        {
            $this->userService->updateUser($user, $input);        
            return new Response();
        }
        catch(BadRequestHttpException $e)
        {
            return new JsonResponse(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("/user/register", name="user_register")
     */
    public function register(Request $request)
    {
        try
        {
            return new Response($this->userService->createUser($request->getContent()));
        }
        catch(BadRequestHttpException $e)
        {
            return new JsonResponse(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("/user/deletemyaccount", name="user_delete")
     */
    public function deleteMyAccount(Request $request)
    {
        $data = $request->headers->get("user");
        $user = $this->userService->getUserFromSerialized($data);
        $this->userService->removeUser($user);
        return new Response();
    }
}
