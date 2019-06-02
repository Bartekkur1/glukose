<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Meal;
use App\Entity\User;
use App\Responses\Responses;
use App\Entity\MealPart;
use Symfony\Component\HttpFoundation\Request;

class MealPartController extends AbstractController
{

    private $em;
    private $mealPartRepo;
    private $mealRepo;
    
    function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
        $this->mealPartRepo = $this->em->getRepository(MealPart::class);
        $this->mealRepo = $this->em->getRepository(Meal::class);
    }

    /**
     * @Route("/api/mealpart", name="new_mealPart", methods={"POST"})
     */
    public function new(Request $request) 
    {   
        $data = json_decode($request->getContent(), true);
        $mealPart = new MealPart();
        $mealPart->setKcal(0);
        $mealPart->setName("");
        $mealPart->setWeight(0);
        $meal = new Meal();
        $owner = $this->mealRepo->findOneBy(["id" => $data["id"]]);
        if(isset($data["weight"]))
            $mealPart->updateFromInput($data);
        $mealPart->updateFromInput($data);
        $mealPart->setMeal($owner);
        $this->em->persist($mealPart);
        $this->em->flush();
        return new JsonResponse();
    }

    /**
     * @Route("/api/mealpart/{id}", name="delete_mealPart", methods={"DELETE"})
     */
    public function delete(Request $request, $id)
    {
        if(!$id)
            return new JsonResponse(["error" => "Nie podano id"]);

        if(!$foundObject = $this->mealPartRepo->findOneBy(["id" => $id]))
            return new JsonResponse(["error" => "Rekord nie istnieje"]);

        $meal = $foundObject->getMeal();
        $owner = $meal->getUser();

        if($owner->getId() != $this->getUser()->getId())
            return new JsonResponse("", 401);

        $meal->removeMealPart($foundObject);
        $this->em->persist($meal);
        $this->em->remove($foundObject);
        $this->em->flush();
        return new JsonResponse();
    }

    /**
     * @Route("/api/mealpart/{id}", name="find_mealPart", methods={"GET"})
     */
    public function index($id)
    {
        if(!$id)
            return Responses::BadRequest(["error" => "Nie podano id"]);
        $meal = $this->mealRepo->findOneBy(["id" => $id]);
        $mps = $this->mealPartRepo->findBy(["meal" => $meal]);
        return new JsonResponse($mps);
    }

    /**
     * @Route("/api/mealpart", name="update_mealPart", methods={"PATCH"})
     */
    public function update(Request $request) 
    {
        $data = json_decode($request->getContent(), true);

        if(!isset($data["id"]))
            return new JsonResponse(["error" => "Nie podano id"]);
        if(!$meal = $this->mealPartRepo->findOneBy(["id" => $data["id"]]))
            return new JsonResponse(["error" => "Rekord nie istnieje"]);

        $owner = $meal->getMeal();
        if($owner->getUser()->getId() != $this->getUser()->getId())
            return new JsonResponse("", 401);

        $meal->updateFromInput($data);
        $this->em->persist($meal);
        $this->em->flush();
        return new JsonResponse();
    }
}
