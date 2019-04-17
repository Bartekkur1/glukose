<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Entity\Sugar;
use App\Entity\Dose;
use App\Entity\Meal;
use App\Entity\MealPart;
use App\Responses\Responses;
use Symfony\Component\HttpFoundation\JsonResponse;

class RecordController extends AbstractController implements TokenAuthenticatedController
{
    // SELECT avg(sugar.amount), HOUR(sugar.date) FROM `sugar` GROUP BY HOUR(sugar.date)
    private $entityManager;

    function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/delete_record/{type}/{id}", name="delete_record")
     */
    public function delete(Request $request, $type, $id)
    {
        if(!$id)
            return Responses::BadRequest(["error" => "Nie podano id"]);
        $user = new User();
        $user->unserialize($request->request->get("user"));
        $entityManager = $this->getDoctrine()->getManager();

        if($type == "sugar")
            $object = $entityManager->getRepository(Sugar::class);
        else if($type == "dose")
            $object = $entityManager->getRepository(Dose::class);
        else if($type == "meal")
            $object = $entityManager->getRepository(Meal::class);
        else if($type == "mealPart")
            $object = $entityManager->getRepository(MealPart::class);
        else
            return Responses::BadRequest();

        if(!$foundObject = $object->findOneBy(["id" => $id]))
            return Responses::BadRequest(["error" => "Rekord nie istnieje"]);
        
        if($foundObject->getUser()->getId() != $user->getId())
            return Responses::PermisionDenied();
        
        $entityManager->remove($foundObject);
        $entityManager->flush();
        return Responses::Ok();
    }


    /**
     * @Route("/find_record/{type}/{date}/{range}", name="find_record")
     */
    public function find(Request $request, $type, $date = null, $range = null)
    {
        $user = new User();
        $user->unserialize($request->request->get("user"));
        $entityManager = $this->getDoctrine()->getManager();

        if($type == "sugar")
            $object = $entityManager->getRepository(Sugar::class);
        else if($type == "dose")
            $object = $entityManager->getRepository(Dose::class);
        else if($type == "meal")
            $object = $entityManager->getRepository(Meal::class);
        else
            return Responses::BadRequest();
        
        if(!$date)
            return new JsonResponse([
                "avg" => $object->AvgAll($user->getId())[0],
                "max" => $object->Max($user->getId())[0],
                "min" => $object->Min($user->getId())[0],
                "values" => $object->findBy(["user" => $user->getId()])
            ], JsonResponse::HTTP_OK);
        else if($date && !$range)
        {
            if($date == "stats")
            {
                $response = array();
                foreach($object->AvgAll($user->getId()) as $record)
                    $response[$record[2]] = $record[1];
                return new JsonResponse($response, JsonResponse::HTTP_OK);
            }
            else if($date == "latest")
                return new JsonResponse(["date" => $object->Latest($user->getId())]);
            else if($date == "avghours")
            {
                if(!$arr = $object->AvgAllByHours($user->getid()))
                    $arr = [0];
                return new JsonResponse([
                    "values" => $arr,
                    "max" => max($arr),
                    "min" => min($arr),
                ]);
            }

            return new JsonResponse([
                "avg" => $object->AvgByDate($date, $user->getId())[0],
                "max" => $object->MaxDate($user->getId(), $date)[0],
                "min" => $object->MinDate($user->getId(), $date)[0],
                "values" => $object->AllByDate($date, $user->getId())
            ], JsonResponse::HTTP_OK);
        }
        else if($date && $range)
            if($date == "id")
                return new JsonResponse(["value" => $object->findOneBy(["id" => $range])]);
            else
                return new JsonResponse([
                    "avg" => $object->AvgByRange($date, $range, $user->getId())[0],
                    "max" => $object->MaxDateRange($user->getId(), $date, $range)[0],
                    "min" => $object->MinDateRange($user->getId(), $date, $range)[0],
                    "values" => $object->AllByRange($date, $range, $user->getId())
                ], JsonResponse::HTTP_OK);

        return Responses::BadRequest();
    }
}
