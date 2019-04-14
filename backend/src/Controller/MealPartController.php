<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Meal;
use App\Entity\MealPart;

class MealPartController extends AbstractController implements TokenAuthenticatedController
{

    private $entityManager;

    function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/mealpart/{id}", name="find_mealPart")
     */
    public function index($id)
    {
        if(!$id)
            return Responses::BadRequest(["error" => "Nie podano id"]);
        $entityManager = $this->getDoctrine()->getManager();
        $meals = $entityManager->getRepository(Meal::class);
        $mealparts = $entityManager->getRepository(MealPart::class);
        $meal = $meals->findOneBy(["id" => $id]);
        $mps = $mealparts->findBy(["meal" => $meal]);
        return new JsonResponse($mps);
    }
}
